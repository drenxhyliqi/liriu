from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from app.models.order import Order


class OrderItem(Base):
    """A snapshot of what the customer requested, not a foreign key to
    `products` - editing or deleting a product later must never rewrite
    what was actually asked for. `product_slug` is kept so the admin can
    still jump to the product while it exists.
    """

    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    order: Mapped["Order"] = relationship(back_populates="items")

    product_slug: Mapped[str | None] = mapped_column(String(120))
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    group_name: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    image_url: Mapped[str | None] = mapped_column(String(500))
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
