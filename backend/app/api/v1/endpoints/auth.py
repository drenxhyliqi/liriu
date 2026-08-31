from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.core.security import create_access_token, verify_password
from app.models.admin_user import AdminUser
from app.schemas.auth import LoginRequest, Token

router = APIRouter()


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> Token:
    """Replaces /api/auth/login on the frontend, which today always
    returns 501 (no auth backend exists yet - see that route's comment).
    An admin is created via `python -m scripts.create_admin`
    (backend/scripts/create_admin.py) - there is no public signup, since
    this is a single-team internal CMS, not a multi-tenant product.
    """
    admin = db.query(AdminUser).filter(AdminUser.email == payload.email).first()
    if admin is None or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Kredenciale të pasakta.")
    if not admin.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Llogaria është çaktivizuar.")

    return Token(access_token=create_access_token(subject=admin.email))


@router.get("/me")
def read_me(admin: AdminUser = Depends(get_current_admin)) -> dict:
    return {"email": admin.email}
