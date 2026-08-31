from typing import TYPE_CHECKING

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.product import Product


class Category(Base, TimestampMixin):
    """Mirrors the frontend's `ProductGroup` (src/types/index.ts) - the
    top level of the catalog (e.g. "Sinjalistikë Vertikale"). Named
    `Category` here rather than `ProductGroup` since that's the clearer
    backend/admin term; the frontend's `groupSlug` field maps to this
    table's `slug`.
    """

    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    products: Mapped[list["Product"]] = relationship(back_populates="category", cascade="all, delete-orphan")
