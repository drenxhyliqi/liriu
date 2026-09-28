from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.base import CamelModel

ImageFit = Literal["cover", "contain"]


class CategoryCreate(CamelModel):
    name: str = Field(min_length=1, max_length=200)
    # Generated from the name when omitted.
    slug: str | None = Field(default=None, max_length=120)
    description: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    image_fit: ImageFit = "cover"
    parent_id: int | None = None
    sort_order: int = 0
    is_active: bool = True


class CategoryUpdate(CamelModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    slug: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    image_fit: ImageFit | None = None
    parent_id: int | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class CategoryRead(CamelModel):
    id: int
    slug: str
    name: str
    description: str | None
    image_url: str | None
    image_fit: str
    parent_id: int | None
    sort_order: int
    is_active: bool
    product_count: int = 0
    child_count: int = 0
    created_at: datetime
    updated_at: datetime
