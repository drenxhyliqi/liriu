from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.category import Category


class Product(Base, TimestampMixin):
    """Something a visitor can add to a quote request - a single sign, a
    cone, a pole. Linked to one or more categories (a sign like "Vendparkim"
    is listed under both Shenjat e Lajmërimit and Sinjalistikë Parkimi).
    """

    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    # Extra search terms not shown on the page (e.g. "stop" for "Ndalim i detyruar").
    keywords: Mapped[str] = mapped_column(String(500), default="", nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500))
    image_fit: Mapped[str] = mapped_column(String(10), default="contain", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    category_links: Mapped[list["ProductCategory"]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="ProductCategory.position"
    )


class ProductCategory(Base):
    """Product <-> category link. `position` orders products within that one
    category, so the same sign can sit first in one list and tenth in another.
    """

    __tablename__ = "product_categories"

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True, index=True
    )
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    product: Mapped[Product] = relationship(back_populates="category_links")
    category: Mapped["Category"] = relationship(back_populates="product_links")
