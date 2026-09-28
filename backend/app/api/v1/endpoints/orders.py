from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_admin, get_db
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.common import Page
from app.schemas.order import OrderCreate, OrderRead, OrderUpdate
from app.services.email import OrderLine, OrderSummary, send_new_order_email
from app.services.media import delete_if_unused

router = APIRouter()


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, background: BackgroundTasks, db: Session = Depends(get_db)) -> Order:
    """Public - what /porosia submits. Item names and images are taken from
    the product record when the slug matches one, so a client can't inject
    arbitrary image URLs into the admin view. The admin is emailed after the
    response is sent, so a mail problem never loses or delays an order.
    """
    slugs = {item.product_slug for item in payload.items if item.product_slug}
    products = {p.slug: p for p in db.query(Product).filter(Product.slug.in_(slugs)).all()} if slugs else {}

    order = Order(
        name=payload.name.strip(),
        email=payload.email.lower(),
        phone=(payload.phone or "").strip() or None,
        note=(payload.note or "").strip() or None,
    )
    for item in payload.items:
        product = products.get(item.product_slug or "")
        order.items.append(
            OrderItem(
                product_slug=product.slug if product else None,
                name=product.name if product else item.name.strip(),
                group_name=item.group_name.strip(),
                image_url=product.image_url if product else None,
                quantity=item.quantity,
            )
        )
    db.add(order)
    db.commit()
    db.refresh(order)

    background.add_task(
        send_new_order_email,
        OrderSummary(
            id=order.id,
            name=order.name,
            email=order.email,
            phone=order.phone,
            note=order.note,
            created_at=order.created_at,
            lines=[OrderLine(i.name, i.group_name, i.quantity, i.image_url) for i in order.items],
        ),
    )
    return order


@router.get("", response_model=Page[OrderRead], dependencies=[Depends(get_current_admin)])
def list_orders(
    db: Session = Depends(get_db),
    status_filter: OrderStatus | None = Query(None, alias="status"),
    q: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="pageSize"),
) -> Page[OrderRead]:
    query = db.query(Order).options(selectinload(Order.items))
    if status_filter is not None:
        query = query.filter(Order.status == status_filter)
    if q:
        like = f"%{q.strip()}%"
        query = query.filter(or_(Order.name.ilike(like), Order.email.ilike(like), Order.phone.ilike(like)))
    total = query.count()
    rows = query.order_by(Order.created_at.desc(), Order.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return Page(items=[OrderRead.model_validate(o) for o in rows], total=total, page=page, page_size=page_size)


def _get_or_404(db: Session, order_id: int) -> Order:
    order = db.query(Order).options(selectinload(Order.items)).filter(Order.id == order_id).first()
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Porosia nuk u gjet.")
    return order


@router.get("/{order_id}", response_model=OrderRead, dependencies=[Depends(get_current_admin)])
def get_order(order_id: int, db: Session = Depends(get_db)) -> Order:
    return _get_or_404(db, order_id)


@router.patch("/{order_id}", response_model=OrderRead, dependencies=[Depends(get_current_admin)])
def update_order(order_id: int, payload: OrderUpdate, db: Session = Depends(get_db)) -> Order:
    """Status and the internal note only - the customer's request itself is never edited."""
    order = _get_or_404(db, order_id)
    changes = payload.model_dump(exclude_unset=True)
    if "status" in changes and changes["status"] is not None:
        order.status = changes["status"]
    if "admin_note" in changes:
        order.admin_note = (changes["admin_note"] or "").strip() or None
    db.commit()
    return _get_or_404(db, order_id)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_order(order_id: int, db: Session = Depends(get_db)) -> None:
    order = _get_or_404(db, order_id)
    images = {item.image_url for item in order.items if item.image_url}
    db.delete(order)
    db.commit()
    for url in images:
        delete_if_unused(db, url)
