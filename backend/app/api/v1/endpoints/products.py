from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_admin, get_db
from app.models.category import Category
from app.models.product import Product, ProductCategory
from app.schemas.common import Page
from app.schemas.product import CategoryRef, ProductCreate, ProductRead, ProductUpdate
from app.services.media import delete_if_unused
from app.services.slugs import slug_taken, slugify, unique_slug

router = APIRouter(dependencies=[Depends(get_current_admin)])


def _to_read(product: Product) -> ProductRead:
    return ProductRead.model_validate(product).model_copy(
        update={"categories": [CategoryRef.model_validate(link.category) for link in product.category_links]}
    )


def _query(db: Session):
    return db.query(Product).options(selectinload(Product.category_links).selectinload(ProductCategory.category))


@router.get("", response_model=Page[ProductRead])
def list_products(
    db: Session = Depends(get_db),
    q: str | None = None,
    category_id: int | None = Query(None, alias="categoryId"),
    uncategorized: bool = False,
    active: bool | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200, alias="pageSize"),
) -> Page[ProductRead]:
    query = _query(db)
    if q:
        like = f"%{q.strip()}%"
        query = query.filter(or_(Product.name.ilike(like), Product.slug.ilike(like), Product.keywords.ilike(like)))
    if category_id is not None:
        query = query.join(ProductCategory).filter(ProductCategory.category_id == category_id)
        query = query.order_by(ProductCategory.position, Product.name)
    else:
        query = query.order_by(Product.created_at.desc(), Product.id.desc())
    if uncategorized:
        query = query.filter(~Product.category_links.any())
    if active is not None:
        query = query.filter(Product.is_active.is_(active))

    total = query.order_by(None).count()
    rows = query.offset((page - 1) * page_size).limit(page_size).all()
    return Page(items=[_to_read(p) for p in rows], total=total, page=page, page_size=page_size)


def _get_or_404(db: Session, product_id: int) -> Product:
    product = _query(db).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Produkti nuk u gjet.")
    return product


def _check_slug(db: Session, slug: str, product_id: int | None = None) -> str:
    slug = slugify(slug)
    if slug_taken(db, slug, product_id=product_id):
        raise HTTPException(status.HTTP_409_CONFLICT, "Ky slug përdoret nga një kategori ose produkt tjetër.")
    return slug


def _set_categories(db: Session, product: Product, category_ids: list[int]) -> None:
    """Keeps positions for categories the product stays in and appends it to
    the end of any newly added category.
    """
    wanted = list(dict.fromkeys(category_ids))
    found = {c.id for c in db.query(Category.id).filter(Category.id.in_(wanted)).all()} if wanted else set()
    missing = set(wanted) - found
    if missing:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Një ose më shumë kategori nuk ekzistojnë.")

    existing = {link.category_id: link for link in product.category_links}
    product.category_links = [link for cid, link in existing.items() if cid in wanted]
    for cid in wanted:
        if cid in existing:
            continue
        last = db.query(func.max(ProductCategory.position)).filter(ProductCategory.category_id == cid).scalar()
        product.category_links.append(ProductCategory(category_id=cid, position=(last or 0) + 1))


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> ProductRead:
    data = payload.model_dump(exclude={"category_ids"})
    data["slug"] = _check_slug(db, payload.slug) if payload.slug else unique_slug(db, payload.name)
    product = Product(**data)
    db.add(product)
    _set_categories(db, product, payload.category_ids)
    db.commit()
    return _to_read(_get_or_404(db, product.id))


@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)) -> ProductRead:
    return _to_read(_get_or_404(db, product_id))


@router.patch("/{product_id}", response_model=ProductRead)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)) -> ProductRead:
    product = _get_or_404(db, product_id)
    changes = payload.model_dump(exclude_unset=True, exclude={"category_ids"})
    if "slug" in changes:
        changes["slug"] = _check_slug(db, changes["slug"], product.id)
    old_image = product.image_url
    for field, value in changes.items():
        setattr(product, field, value)
    if payload.category_ids is not None:
        _set_categories(db, product, payload.category_ids)
    db.commit()
    if old_image != product.image_url:
        delete_if_unused(db, old_image)
    return _to_read(_get_or_404(db, product.id))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)) -> None:
    product = _get_or_404(db, product_id)
    image = product.image_url
    db.delete(product)
    db.commit()
    delete_if_unused(db, image)
