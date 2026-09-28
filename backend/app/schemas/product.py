from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.base import CamelModel

ImageFit = Literal["cover", "contain"]


class ProductCreate(CamelModel):
    name: str = Field(min_length=1, max_length=300)
    # Generated from the name when omitted.
    slug: str | None = Field(default=None, max_length=120)
    description: str = ""
    keywords: str = Field(default="", max_length=500)
    image_url: str | None = Field(default=None, max_length=500)
    image_fit: ImageFit = "contain"
    is_active: bool = True
    category_ids: list[int] = []


class ProductUpdate(CamelModel):
    name: str | None = Field(default=None, min_length=1, max_length=300)
    slug: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = None
    keywords: str | None = Field(default=None, max_length=500)
    image_url: str | None = Field(default=None, max_length=500)
    image_fit: ImageFit | None = None
    is_active: bool | None = None
    category_ids: list[int] | None = None


class CategoryRef(CamelModel):
    id: int
    slug: str
    name: str


class ProductRead(CamelModel):
    id: int
    slug: str
    name: str
    description: str
    keywords: str
    image_url: str | None
    image_fit: str
    is_active: bool
    categories: list[CategoryRef] = []
    created_at: datetime
    updated_at: datetime
