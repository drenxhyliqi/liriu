from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.core.limiter import limiter
from app.models.contact_message import ContactMessage
from app.services.captcha import verify_captcha
from app.schemas.common import Page
from app.schemas.contact_message import ContactMessageCreate, ContactMessageRead, ContactMessageUpdate

router = APIRouter()


@router.post("", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute;50/hour")
def create_contact_message(
    request: Request, payload: ContactMessageCreate, db: Session = Depends(get_db)
) -> ContactMessage:
    """Public - what the /contact form submits. Stored for the dashboard; no
    email is sent yet (needs a confirmed destination address and a provider).
    """
    verify_captcha(payload.captcha_token)

    message = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.lower(),
        phone=(payload.phone or "").strip() or None,
        project_type=(payload.project_type or "").strip() or None,
        message=payload.message.strip(),
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("", response_model=Page[ContactMessageRead], dependencies=[Depends(get_current_admin)])
def list_contact_messages(
    db: Session = Depends(get_db),
    unread: bool = False,
    q: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="pageSize"),
) -> Page[ContactMessageRead]:
    query = db.query(ContactMessage)
    if unread:
        query = query.filter(ContactMessage.is_read.is_(False))
    if q:
        like = f"%{q.strip()}%"
        query = query.filter(
            or_(ContactMessage.name.ilike(like), ContactMessage.email.ilike(like), ContactMessage.message.ilike(like))
        )
    total = query.count()
    rows = (
        query.order_by(ContactMessage.created_at.desc(), ContactMessage.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return Page(items=[ContactMessageRead.model_validate(m) for m in rows], total=total, page=page, page_size=page_size)


def _get_or_404(db: Session, message_id: int) -> ContactMessage:
    message = db.get(ContactMessage, message_id)
    if message is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mesazhi nuk u gjet.")
    return message


@router.get("/{message_id}", response_model=ContactMessageRead, dependencies=[Depends(get_current_admin)])
def get_contact_message(message_id: int, db: Session = Depends(get_db)) -> ContactMessage:
    return _get_or_404(db, message_id)


@router.patch("/{message_id}", response_model=ContactMessageRead, dependencies=[Depends(get_current_admin)])
def update_contact_message(
    message_id: int, payload: ContactMessageUpdate, db: Session = Depends(get_db)
) -> ContactMessage:
    message = _get_or_404(db, message_id)
    message.is_read = payload.is_read
    db.commit()
    db.refresh(message)
    return message


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_contact_message(message_id: int, db: Session = Depends(get_db)) -> None:
    db.delete(_get_or_404(db, message_id))
    db.commit()
