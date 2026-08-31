from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.product_variant import ProductVariant
from app.schemas.product_variant import ProductVariantCreate, ProductVariantRead, ProductVariantUpdate

router = APIRouter()


@router.get("", response_model=list[ProductVariantRead])
def list_variants(
    product_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[ProductVariant]:
    """Public. `product_id` is how /products/[slug] would fetch the design
    list for one product.
    """
    query = db.query(ProductVariant)
    if product_id is not None:
        query = query.filter(ProductVariant.product_id == product_id)
    return query.order_by(ProductVariant.sort_order, ProductVariant.name).all()


@router.post("", response_model=ProductVariantRead, status_code=status.HTTP_201_CREATED)
def create_variant(
    product_id: int,
    payload: ProductVariantCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> ProductVariant:
    exists = (
        db.query(ProductVariant)
        .filter(ProductVariant.product_id == product_id, ProductVariant.slug == payload.slug)
        .first()
    )
    if exists:
        raise HTTPException(status.HTTP_409_CONFLICT, "Ky slug ekziston tashmë për këtë produkt.")
    variant = ProductVariant(product_id=product_id, **payload.model_dump())
    db.add(variant)
    db.commit()
    db.refresh(variant)
    return variant


def _get_variant_or_404(db: Session, variant_id: int) -> ProductVariant:
    variant = db.get(ProductVariant, variant_id)
    if variant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Dizajni nuk u gjet.")
    return variant


@router.get("/{variant_id}", response_model=ProductVariantRead)
def get_variant(variant_id: int, db: Session = Depends(get_db)) -> ProductVariant:
    return _get_variant_or_404(db, variant_id)


@router.patch("/{variant_id}", response_model=ProductVariantRead)
def update_variant(
    variant_id: int,
    payload: ProductVariantUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> ProductVariant:
    variant = _get_variant_or_404(db, variant_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(variant, field, value)
    db.commit()
    db.refresh(variant)
    return variant


@router.delete("/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_variant(
    variant_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> None:
    variant = _get_variant_or_404(db, variant_id)
    db.delete(variant)
    db.commit()
