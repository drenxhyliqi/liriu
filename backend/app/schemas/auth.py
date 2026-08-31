from pydantic import EmailStr

from app.schemas.base import CamelModel


class LoginRequest(CamelModel):
    email: EmailStr
    password: str


class Token(CamelModel):
    access_token: str
    token_type: str = "bearer"
