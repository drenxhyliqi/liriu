import re
import unicodedata

from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product


def slugify(text: str) -> str:
    text = text.lower().replace("ë", "e").replace("ç", "c")
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:100].strip("-") or "pa-emer"


def slug_taken(db: Session, slug: str, *, category_id: int | None = None, product_id: int | None = None) -> bool:
    """Categories and products share one URL namespace (/products/[slug])."""
    category = db.query(Category.id).filter(Category.slug == slug).first()
    if category is not None and category.id != category_id:
        return True
    product = db.query(Product.id).filter(Product.slug == slug).first()
    return product is not None and product.id != product_id


def unique_slug(db: Session, base: str, **exclude: int | None) -> str:
    base = slugify(base)
    slug, n = base, 2
    while slug_taken(db, slug, **exclude):
        slug, n = f"{base}-{n}", n + 1
    return slug
