from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_owner, get_db
from app.core.security import hash_password
from app.models.admin_user import AdminRole, AdminUser
from app.schemas.auth import AdminCreate, AdminRead, AdminUpdate

router = APIRouter()


@router.get("", response_model=list[AdminRead])
def list_admins(db: Session = Depends(get_db), _owner: AdminUser = Depends(get_current_owner)) -> list[AdminUser]:
    return db.query(AdminUser).order_by(AdminUser.created_at).all()


@router.post("", response_model=AdminRead, status_code=status.HTTP_201_CREATED)
def create_admin(
    payload: AdminCreate,
    db: Session = Depends(get_db),
    _owner: AdminUser = Depends(get_current_owner),
) -> AdminUser:
    email = payload.email.lower()
    if db.query(AdminUser.id).filter(AdminUser.email == email).first():
        raise HTTPException(status.HTTP_409_CONFLICT, "Ekziston tashmë një llogari me këtë email.")
    admin = AdminUser(
        email=email,
        full_name=payload.full_name.strip(),
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def _get_admin_or_404(db: Session, admin_id: int) -> AdminUser:
    admin = db.get(AdminUser, admin_id)
    if admin is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Përdoruesi nuk u gjet.")
    return admin


def _ensure_another_owner(db: Session, admin: AdminUser) -> None:
    others = (
        db.query(AdminUser.id)
        .filter(AdminUser.role == AdminRole.OWNER, AdminUser.is_active.is_(True), AdminUser.id != admin.id)
        .count()
    )
    if others == 0:
        raise HTTPException(status.HTTP_409_CONFLICT, "Duhet të mbetet të paktën një pronar aktiv.")


@router.patch("/{admin_id}", response_model=AdminRead)
def update_admin(
    admin_id: int,
    payload: AdminUpdate,
    db: Session = Depends(get_db),
    owner: AdminUser = Depends(get_current_owner),
) -> AdminUser:
    admin = _get_admin_or_404(db, admin_id)
    losing_owner = admin.role == AdminRole.OWNER and (
        (payload.role is not None and payload.role != AdminRole.OWNER) or payload.is_active is False
    )
    if losing_owner:
        _ensure_another_owner(db, admin)
    if admin.id == owner.id and payload.is_active is False:
        raise HTTPException(status.HTTP_409_CONFLICT, "Nuk mund ta çaktivizoni llogarinë tuaj.")

    if payload.full_name is not None:
        admin.full_name = payload.full_name.strip()
    if payload.role is not None:
        admin.role = payload.role
    if payload.is_active is not None:
        admin.is_active = payload.is_active
    if payload.password is not None:
        admin.hashed_password = hash_password(payload.password)
    db.commit()
    db.refresh(admin)
    return admin


@router.delete("/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    owner: AdminUser = Depends(get_current_owner),
) -> None:
    admin = _get_admin_or_404(db, admin_id)
    if admin.id == owner.id:
        raise HTTPException(status.HTTP_409_CONFLICT, "Nuk mund ta fshini llogarinë tuaj.")
    if admin.role == AdminRole.OWNER:
        _ensure_another_owner(db, admin)
    db.delete(admin)
    db.commit()
