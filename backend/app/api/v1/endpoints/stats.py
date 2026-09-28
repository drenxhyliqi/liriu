from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_admin, get_db
from app.models.category import Category
from app.models.contact_message import ContactMessage
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.schemas.contact_message import ContactMessageRead
from app.schemas.order import OrderRead
from app.schemas.stats import Stats

router = APIRouter(dependencies=[Depends(get_current_admin)])


@router.get("", response_model=Stats)
def get_stats(db: Session = Depends(get_db)) -> Stats:
    recent_orders = (
        db.query(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc()).limit(5).all()
    )
    recent_messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(5).all()
    return Stats(
        new_orders=db.query(Order).filter(Order.status == OrderStatus.NEW).count(),
        open_orders=db.query(Order).filter(Order.status != OrderStatus.CLOSED).count(),
        total_orders=db.query(Order).count(),
        unread_messages=db.query(ContactMessage).filter(ContactMessage.is_read.is_(False)).count(),
        total_messages=db.query(ContactMessage).count(),
        products=db.query(Product).count(),
        categories=db.query(Category).count(),
        recent_orders=[OrderRead.model_validate(o) for o in recent_orders],
        recent_messages=[ContactMessageRead.model_validate(m) for m in recent_messages],
    )
