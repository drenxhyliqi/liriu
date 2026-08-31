from datetime import datetime

from pydantic import EmailStr, field_validator

from app.models.order import OrderStatus
from app.schemas.base import CamelModel


class OrderItemCreate(CamelModel):
    """Matches the frontend's CartItem shape (src/types/index.ts): `key` is
    dropped (it's a frontend-only composite React key, not domain data).
    Today's /api/orders route doesn't actually send `product_slug`/
    `variant_slug` even though CartItem carries them - that's a one-line
    gap to close in order-request.tsx's fetch body when this API replaces
    that route (see backend/README.md).
    """

    product_slug: str
    variant_slug: str | None = None
    name: str
    group_name: str
    quantity: int = 1


class OrderCreate(CamelModel):
    name: str
    email: EmailStr
    phone: str | None = None
    note: str | None = None
    items: list[OrderItemCreate]

    @field_validator("items")
    @classmethod
    def items_not_empty(cls, value: list[OrderItemCreate]) -> list[OrderItemCreate]:
        if not value:
            raise ValueError("Porosia nuk ka artikuj.")
        return value


class OrderItemRead(CamelModel):
    id: int
    product_slug: str
    variant_slug: str | None
    name: str
    group_name: str
    quantity: int


class OrderRead(CamelModel):
    id: int
    name: str
    email: str
    phone: str | None
    note: str | None
    status: OrderStatus
    items: list[OrderItemRead]
    created_at: datetime


class OrderStatusUpdate(CamelModel):
    status: OrderStatus
