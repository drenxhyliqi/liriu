from datetime import datetime

from pydantic import EmailStr, Field

from app.models.admin_user import AdminRole
from app.schemas.base import CamelModel


class LoginRequest(CamelModel):
    email: EmailStr
    password: str


class Token(CamelModel):
    access_token: str
    token_type: str = "bearer"


class AdminRead(CamelModel):
    id: int
    email: str
    full_name: str
    role: AdminRole
    is_active: bool
    last_login_at: datetime | None
    created_at: datetime


class ProfileUpdate(CamelModel):
    email: EmailStr | None = None
    full_name: str | None = Field(default=None, max_length=200)


class PasswordChange(CamelModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=72)


class AdminCreate(CamelModel):
    email: EmailStr
    full_name: str = Field(default="", max_length=200)
    password: str = Field(min_length=8, max_length=72)
    role: AdminRole = AdminRole.ADMIN


class AdminUpdate(CamelModel):
    full_name: str | None = Field(default=None, max_length=200)
    role: AdminRole | None = None
    is_active: bool | None = None
    password: str | None = Field(default=None, min_length=8, max_length=72)
