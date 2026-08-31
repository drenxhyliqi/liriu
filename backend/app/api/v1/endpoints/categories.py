from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter()


@router.get("", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)) -> list[Category]:
    """Public - the catalog nav/sidebar needs this without an admin session."""
    return db.query(Category).order_by(Category.sort_order, Category.name).all()


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Category:
    if db.query(Category).filter(Category.slug == payload.slug).first():
        raise HTTPException(status.HTTP_409_CONFLICT, "Ky slug ekziston tashmë.")
    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def _get_category_or_404(db: Session, category_id: int) -> Category:
    category = db.get(Category, category_id)
    if category is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Kategoria nuk u gjet.")
    return category


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)) -> Category:
    return _get_category_or_404(db, category_id)


@router.patch("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Category:
    category = _get_category_or_404(db, category_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> None:
    """Cascades to the category's products/variants (see the `cascade` on
    Category.products / Product.variants) - deliberately, since an orphaned
    product with no category makes no sense in this catalog. The admin UI
    should warn about this before calling it.
    """
    category = _get_category_or_404(db, category_id)
    db.delete(category)
    db.commit()
