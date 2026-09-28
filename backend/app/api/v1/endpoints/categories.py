from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.category import Category
from app.models.product import ProductCategory
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.services.media import delete_if_unused
from app.services.slugs import slug_taken, slugify, unique_slug

router = APIRouter(dependencies=[Depends(get_current_admin)])


def _to_read(db: Session, category: Category) -> CategoryRead:
    product_count = db.query(func.count()).filter(ProductCategory.category_id == category.id).scalar()
    child_count = db.query(func.count(Category.id)).filter(Category.parent_id == category.id).scalar()
    return CategoryRead.model_validate(category).model_copy(
        update={"product_count": product_count, "child_count": child_count}
    )


@router.get("", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)) -> list[CategoryRead]:
    """Every category, including inactive ones, flat - the admin UI builds the tree."""
    product_counts = dict(
        db.query(ProductCategory.category_id, func.count()).group_by(ProductCategory.category_id).all()
    )
    child_counts = dict(
        db.query(Category.parent_id, func.count(Category.id))
        .filter(Category.parent_id.is_not(None))
        .group_by(Category.parent_id)
        .all()
    )
    categories = db.query(Category).order_by(Category.sort_order, Category.name).all()
    return [
        CategoryRead.model_validate(c).model_copy(
            update={"product_count": product_counts.get(c.id, 0), "child_count": child_counts.get(c.id, 0)}
        )
        for c in categories
    ]


def _get_or_404(db: Session, category_id: int) -> Category:
    category = db.get(Category, category_id)
    if category is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Kategoria nuk u gjet.")
    return category


def _validate_parent(db: Session, parent_id: int | None, category_id: int | None = None) -> None:
    """Rejects a missing parent, and a parent that would create a cycle."""
    if parent_id is None:
        return
    node = db.get(Category, parent_id)
    if node is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Kategoria prind nuk ekziston.")
    while node is not None:
        if category_id is not None and node.id == category_id:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, "Një kategori nuk mund të vendoset brenda vetes ose nënkategorive të saj."
            )
        node = node.parent


def _check_slug(db: Session, slug: str, category_id: int | None = None) -> str:
    slug = slugify(slug)
    if slug_taken(db, slug, category_id=category_id):
        raise HTTPException(status.HTTP_409_CONFLICT, "Ky slug përdoret nga një kategori ose produkt tjetër.")
    return slug


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)) -> CategoryRead:
    _validate_parent(db, payload.parent_id)
    data = payload.model_dump()
    data["slug"] = _check_slug(db, payload.slug) if payload.slug else unique_slug(db, payload.name)
    category = Category(**data)
    db.add(category)
    db.commit()
    db.refresh(category)
    return _to_read(db, category)


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)) -> CategoryRead:
    return _to_read(db, _get_or_404(db, category_id))


@router.patch("/{category_id}", response_model=CategoryRead)
def update_category(category_id: int, payload: CategoryUpdate, db: Session = Depends(get_db)) -> CategoryRead:
    category = _get_or_404(db, category_id)
    changes = payload.model_dump(exclude_unset=True)
    if "parent_id" in changes:
        _validate_parent(db, changes["parent_id"], category.id)
    if "slug" in changes:
        changes["slug"] = _check_slug(db, changes["slug"], category.id)
    old_image = category.image_url
    for field, value in changes.items():
        setattr(category, field, value)
    db.commit()
    if old_image != category.image_url:
        delete_if_unused(db, old_image)
    db.refresh(category)
    return _to_read(db, category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)) -> None:
    """Refuses while the category has subcategories. Its products are only
    unlinked, never deleted - a product may live in other categories too.
    """
    category = _get_or_404(db, category_id)
    if db.query(Category.id).filter(Category.parent_id == category.id).first():
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Kategoria ka nënkategori. Fshini ose zhvendosni ato së pari."
        )
    image = category.image_url
    db.delete(category)
    db.commit()
    delete_if_unused(db, image)
