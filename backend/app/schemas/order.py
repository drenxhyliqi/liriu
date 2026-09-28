from datetime import datetime

from pydantic import EmailStr, Field

from app.models.order import OrderStatus
from app.schemas.base import CamelModel


class OrderItemCreate(CamelModel):
    """One cart line from /porosia. When `product_slug` matches a product, the
    stored name and image come from the database, not from the client.
    """

    product_slug: str | None = Field(default=None, max_length=120)
    name: str = Field(min_length=1, max_length=300)
    group_name: str = Field(default="", max_length=200)
    quantity: int = Field(default=1, ge=1, le=100000)


class OrderCreate(CamelModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=50)
    note: str | None = Field(default=None, max_length=5000)
    items: list[OrderItemCreate] = Field(min_length=1, max_length=300)


class OrderItemRead(CamelModel):
    id: int
    product_slug: str | None
    name: str
    group_name: str
    image_url: str | None
    quantity: int


class OrderRead(CamelModel):
    id: int
    name: str
    email: str
    phone: str | None
    note: str | None
    status: OrderStatus
    admin_note: str | None
    items: list[OrderItemRead]
    created_at: datetime
    updated_at: datetime


class OrderUpdate(CamelModel):
    status: OrderStatus | None = None
    admin_note: str | None = Field(default=None, max_length=5000)
