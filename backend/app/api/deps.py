from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db as _get_db
from app.models.admin_user import AdminRole, AdminUser

get_db = _get_db

_bearer = HTTPBearer(auto_error=False)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> AdminUser:
    """Guards every admin-only route. The public catalog, order and contact
    endpoints don't use it.
    """
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kërkohet identifikim.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    subject = decode_access_token(credentials.credentials)
    if subject is None or not subject.isdigit():
        raise unauthorized

    admin = db.get(AdminUser, int(subject))
    if admin is None or not admin.is_active:
        raise unauthorized

    return admin


def get_current_owner(admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    if admin.role != AdminRole.OWNER:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Vetëm pronari mund ta bëjë këtë veprim.")
    return admin
