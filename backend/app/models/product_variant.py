from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.product import Product


class ProductVariant(Base, TimestampMixin):
    """Mirrors the frontend's `ProductVariant` - a specific design within a
    product (e.g. "Ndalese" under "Shenja Trafiku"), shown at
    /products/[slug]/[variant]. This is the level product photography
    actually belongs at, per the original request ("after that is clicked
    it will show different designs of those specified products").
    """

    __tablename__ = "product_variants"
    __table_args__ = (UniqueConstraint("product_id", "slug", name="uq_variant_product_slug"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    product: Mapped["Product"] = relationship(back_populates="variants")

    image_url: Mapped[str | None] = mapped_column(String(500))
    image_public_id: Mapped[str | None] = mapped_column(String(255))
