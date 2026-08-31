from datetime import datetime

from pydantic import EmailStr

from app.schemas.base import CamelModel


class ContactMessageCreate(CamelModel):
    """Matches /api/contact's existing payload exactly (name, email, phone?,
    projectType?, message).
    """

    name: str
    email: EmailStr
    phone: str | None = None
    project_type: str | None = None
    message: str


class ContactMessageRead(CamelModel):
    id: int
    name: str
    email: str
    phone: str | None
    project_type: str | None
    message: str
    is_read: bool
    created_at: datetime
