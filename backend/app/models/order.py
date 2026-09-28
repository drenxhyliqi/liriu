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
    QUOTED = "quoted"
    CLOSED = "closed"


class Order(Base, TimestampMixin):
    """A quote request submitted from /porosia. Not a paid checkout - the site
    has no verified prices, so the admin follows up by phone/email and tracks
    progress with `status`.
    """

    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50))
    note: Mapped[str | None] = mapped_column(Text)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, values_callable=lambda e: [m.value for m in e], name="order_status"),
        default=OrderStatus.NEW,
        nullable=False,
        index=True,
    )
    # Internal only, never shown to the customer.
    admin_note: Mapped[str | None] = mapped_column(Text)

    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan", order_by="OrderItem.id"
    )
