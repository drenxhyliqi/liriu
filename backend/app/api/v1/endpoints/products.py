from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate, ProductWithVariants

router = APIRouter()


@router.get("", response_model=list[ProductRead])
def list_products(
    category_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Product]:
    """Public. `category_id` mirrors how the frontend's category sidebar
    filters products by group today (src/components/sections/category-sidebar.tsx).
    """
    query = db.query(Product)
    if category_id is not None:
        query = query.filter(Product.category_id == category_id)
    return query.order_by(Product.sort_order, Product.name).all()


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Product:
    if db.query(Product).filter(Product.slug == payload.slug).first():
        raise HTTPException(status.HTTP_409_CONFLICT, "Ky slug ekziston tashmë.")
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def _get_product_or_404(db: Session, product_id: int, *, with_variants: bool = False) -> Product:
    query = db.query(Product)
    if with_variants:
        query = query.options(joinedload(Product.variants))
    product = query.filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Produkti nuk u gjet.")
    return product


@router.get("/{product_id}", response_model=ProductWithVariants)
def get_product(product_id: int, db: Session = Depends(get_db)) -> Product:
    """Public. Includes variants inline - this is the call the
    /products/[slug] detail page would make.
    """
    return _get_product_or_404(db, product_id, with_variants=True)


@router.patch("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Product:
    product = _get_product_or_404(db, product_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> None:
    product = _get_product_or_404(db, product_id)
    db.delete(product)
    db.commit()
