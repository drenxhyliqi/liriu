from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from app.models.order import Order


class OrderItem(Base):
    """A line item on an order request. Deliberately a snapshot, not a
    foreign key to `Product`/`ProductVariant` - mirrors the frontend's
    `CartItem` (name, groupName, quantity, and the slugs) as sent by
    /api/orders today. A snapshot means a catalog edit or deletion months
    later can never silently rewrite what a customer actually asked for.
    """

    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    order: Mapped["Order"] = relationship(back_populates="items")

    product_slug: Mapped[str] = mapped_column(String(120), nullable=False)
    variant_slug: Mapped[str | None] = mapped_column(String(120))
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    group_name: Mapped[str] = mapped_column(String(200), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
