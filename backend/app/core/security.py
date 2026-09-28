from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from app.core.config import settings

# bcrypt directly, not passlib - passlib 1.7.4's bcrypt backend breaks
# against bcrypt>=4.1 (it probes `bcrypt.__about__.__version__`, which was
# removed), and passlib itself hasn't seen a compatible release. bcrypt's
# own API is simple enough not to need a wrapper.
_BCRYPT_MAX_BYTES = 72  # bcrypt silently ignores anything past this - reject instead


def hash_password(plain_password: str) -> str:
    password_bytes = plain_password.encode("utf-8")
    if len(password_bytes) > _BCRYPT_MAX_BYTES:
        raise ValueError("Password too long (max 72 bytes).")
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_access_token(token: str) -> str | None:
    """Returns the subject (the admin's id) if the token is valid, else None."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.JWTError:
        return None
    return payload.get("sub")
