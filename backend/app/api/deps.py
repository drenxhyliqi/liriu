from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db as _get_db
from app.models.admin_user import AdminUser

get_db = _get_db

_bearer = HTTPBearer(auto_error=False)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> AdminUser:
    """Guards every admin-only route (categories/products/variants writes,
    orders, contact messages, uploads). Read-only catalog endpoints
    (GET categories/products/variants) are intentionally left public - the
    public site needs to read them without an admin session.
    """
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kërkohet identifikim.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    email = decode_access_token(credentials.credentials)
    if email is None:
        raise unauthorized

    admin = db.query(AdminUser).filter(AdminUser.email == email, AdminUser.is_active.is_(True)).first()
    if admin is None:
        raise unauthorized

    return admin
