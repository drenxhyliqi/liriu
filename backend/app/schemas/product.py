from datetime import datetime

from app.schemas.base import CamelModel
from app.schemas.product_variant import ProductVariantRead


class ProductBase(CamelModel):
    slug: str
    name: str
    description: str = ""
    sort_order: int = 0


class ProductCreate(ProductBase):
    category_id: int


class ProductUpdate(CamelModel):
    slug: str | None = None
    name: str | None = None
    description: str | None = None
    sort_order: int | None = None
    category_id: int | None = None
    # Set after a direct-to-Cloudinary upload completes (see
    # services/cloudinary.py) - the admin UI PATCHes these two together.
    image_url: str | None = None
    image_public_id: str | None = None


class ProductRead(ProductBase):
    id: int
    category_id: int
    image_url: str | None = None
    image_public_id: str | None = None
    created_at: datetime
    updated_at: datetime


class ProductWithVariants(ProductRead):
    variants: list[ProductVariantRead] = []
