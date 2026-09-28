from app.schemas.base import CamelModel
from app.schemas.contact_message import ContactMessageRead
from app.schemas.order import OrderRead


class Stats(CamelModel):
    new_orders: int
    open_orders: int
    total_orders: int
    unread_messages: int
    total_messages: int
    products: int
    categories: int
    recent_orders: list[OrderRead]
    recent_messages: list[ContactMessageRead]
