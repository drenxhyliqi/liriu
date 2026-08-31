from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate, OrderRead, OrderStatusUpdate

router = APIRouter()


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> Order:
    """Public - this is what /porosia submits to. Replaces /api/orders,
    which today validates and logs the same shape but doesn't persist it
    (see that route's comment, and the admin dashboard's "Porositë nuk
    ruhen ende" empty state this table exists to replace).
    """
    order = Order(name=payload.name, email=payload.email, phone=payload.phone, note=payload.note)
    order.items = [OrderItem(**item.model_dump()) for item in payload.items]
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=list[OrderRead])
def list_orders(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> list[Order]:
    """Admin-only - feeds the dashboard's "Porosite" view."""
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .order_by(Order.created_at.desc())
        .all()
    )


def _get_order_or_404(db: Session, order_id: int) -> Order:
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Porosia nuk u gjet.")
    return order


@router.get("/{order_id}", response_model=OrderRead)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Order:
    return _get_order_or_404(db, order_id)


@router.patch("/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Order:
    """The only mutation an order gets - triaging (new -> contacted ->
    closed), never editing the customer's actual request.
    """
    order = _get_order_or_404(db, order_id)
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
