from datetime import datetime

from app.schemas.base import CamelModel


class ProductVariantBase(CamelModel):
    slug: str
    name: str
    description: str | None = None
    sort_order: int = 0


class ProductVariantCreate(ProductVariantBase):
    pass


class ProductVariantUpdate(CamelModel):
    slug: str | None = None
    name: str | None = None
    description: str | None = None
    sort_order: int | None = None
    image_url: str | None = None
    image_public_id: str | None = None


class ProductVariantRead(ProductVariantBase):
    id: int
    product_id: int
    image_url: str | None = None
    image_public_id: str | None = None
    created_at: datetime
    updated_at: datetime
