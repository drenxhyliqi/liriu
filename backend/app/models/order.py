import enum
from typing import TYPE_CHECKING

from sqlalchemy import Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.order_item import OrderItem


class OrderStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    CLOSED = "closed"


class Order(Base, TimestampMixin):
    """A quote request submitted from /porosia. This is NOT a paid checkout
    (see order-request.tsx / api/orders/route.ts on the frontend - the site
    deliberately has no real payment flow since there are no verified
    prices). `status` exists so the admin dashboard's "Porosite" view has
    something to triage against once it reads from this API instead of
    showing its current "not persisted yet" empty state.
    """

    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50))
    note: Mapped[str | None] = mapped_column(Text)
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.NEW, nullable=False)

    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
