from datetime import datetime

from app.schemas.base import CamelModel


class CategoryBase(CamelModel):
    slug: str
    name: str
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CamelModel):
    slug: str | None = None
    name: str | None = None
    sort_order: int | None = None


class CategoryRead(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
