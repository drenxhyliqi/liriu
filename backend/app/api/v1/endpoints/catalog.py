from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.catalog import Catalog, CatalogCategory, CatalogProduct, Placement

router = APIRouter()


@router.get("", response_model=Catalog)
def get_catalog(db: Session = Depends(get_db)) -> Catalog:
    """Public. Only active categories whose ancestors are all active, and only
    active products - hiding a category hides its whole branch.
    """
    categories = db.query(Category).order_by(Category.sort_order, Category.name).all()
    by_id = {c.id: c for c in categories}

    visible: set[int] = set()

    def is_visible(category: Category) -> bool:
        node = category
        while node is not None:
            if not node.is_active:
                return False
            node = by_id.get(node.parent_id) if node.parent_id else None
        return True

    for category in categories:
        if is_visible(category):
            visible.add(category.id)

    products = (
        db.query(Product)
        .options(selectinload(Product.category_links))
        .filter(Product.is_active.is_(True))
        .order_by(Product.id)
        .all()
    )

    return Catalog(
        categories=[CatalogCategory.model_validate(c) for c in categories if c.id in visible],
        products=[
            CatalogProduct.model_validate(p).model_copy(
                update={
                    "placements": [
                        Placement(category_id=link.category_id, position=link.position)
                        for link in p.category_links
                        if link.category_id in visible
                    ]
                }
            )
            for p in products
        ],
    )
