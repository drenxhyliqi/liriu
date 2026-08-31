from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.product_variant import ProductVariant


class Product(Base, TimestampMixin):
    """Mirrors the frontend's `Product` type - a product type within a
    category (e.g. "Shenja Trafiku" under "Sinjalistikë Vertikale").
    `image_url`/`image_public_id` are new versus the current static data
    (src/lib/data/products.ts has no images yet - the site renders abstract
    icon panels) - see services/cloudinary.py for how these get populated.
    """

    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    category: Mapped["Category"] = relationship(back_populates="products")

    # Cloudinary secure_url and public_id (the latter needed to delete/replace
    # the asset later). Both nullable - a product can exist before it has a
    # photo, same as today's static catalog.
    image_url: Mapped[str | None] = mapped_column(String(500))
    image_public_id: Mapped[str | None] = mapped_column(String(255))

    variants: Mapped[list["ProductVariant"]] = relationship(
        back_populates="product", cascade="all, delete-orphan"
    )
