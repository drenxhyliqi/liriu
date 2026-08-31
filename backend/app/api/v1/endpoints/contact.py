from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate, ContactMessageRead

router = APIRouter()


@router.post("", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
def create_contact_message(payload: ContactMessageCreate, db: Session = Depends(get_db)) -> ContactMessage:
    """Public - replaces /api/contact, which today validates and logs the
    same shape but doesn't persist it (see that route's TODO). Still does
    NOT send an email or notify anyone - see [[contact_form_not_wired]]:
    that needs a confirmed destination address and an email provider
    (e.g. Resend) wired in separately from this persistence layer.
    """
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("", response_model=list[ContactMessageRead])
def list_contact_messages(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> list[ContactMessage]:
    """Admin-only - feeds the dashboard's "Mesazhet" view."""
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.patch("/{message_id}/read", response_model=ContactMessageRead)
def mark_read(
    message_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> ContactMessage:
    message = db.get(ContactMessage, message_id)
    if message is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mesazhi nuk u gjet.")
    message.is_read = True
    db.commit()
    db.refresh(message)
    return message
