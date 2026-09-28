from datetime import datetime

from pydantic import EmailStr, Field

from app.schemas.base import CamelModel


class ContactMessageCreate(CamelModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=50)
    project_type: str | None = Field(default=None, max_length=200)
    message: str = Field(min_length=1, max_length=10000)


class ContactMessageRead(CamelModel):
    id: int
    name: str
    email: str
    phone: str | None
    project_type: str | None
    message: str
    is_read: bool
    created_at: datetime


class ContactMessageUpdate(CamelModel):
    is_read: bool
