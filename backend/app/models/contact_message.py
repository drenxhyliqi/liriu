from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base
from app.models.mixins import TimestampMixin


class ContactMessage(Base, TimestampMixin):
    """A /contact form submission. Mirrors the payload /api/contact already
    validates and logs (name, email, phone?, projectType?, message) - this
    table is where that would persist to once the frontend route is wired
    to this API instead of console.log.
    """

    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50))
    project_type: Mapped[str | None] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
