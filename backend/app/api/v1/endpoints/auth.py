from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.admin_user import AdminUser
from app.schemas.auth import AdminRead, LoginRequest, PasswordChange, ProfileUpdate, Token

router = APIRouter()


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> Token:
    admin = db.query(AdminUser).filter(AdminUser.email == payload.email.lower()).first()
    if admin is None or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Email-i ose fjalëkalimi është i pasaktë.")
    if not admin.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Llogaria është çaktivizuar.")

    admin.last_login_at = datetime.now(timezone.utc)
    db.commit()
    # The token carries the id, not the email, so changing email doesn't log you out.
    return Token(access_token=create_access_token(subject=str(admin.id)))


@router.get("/me", response_model=AdminRead)
def read_me(admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    return admin


@router.patch("/me", response_model=AdminRead)
def update_me(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
) -> AdminUser:
    if payload.email is not None:
        email = payload.email.lower()
        taken = db.query(AdminUser.id).filter(AdminUser.email == email, AdminUser.id != admin.id).first()
        if taken:
            raise HTTPException(status.HTTP_409_CONFLICT, "Ky email përdoret nga një llogari tjetër.")
        admin.email = email
    if payload.full_name is not None:
        admin.full_name = payload.full_name.strip()
    db.commit()
    db.refresh(admin)
    return admin


@router.post("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
) -> None:
    if not verify_password(payload.current_password, admin.hashed_password):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Fjalëkalimi aktual është i pasaktë.")
    admin.hashed_password = hash_password(payload.new_password)
    db.commit()
