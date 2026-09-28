"""Imports every model so Alembic's autogenerate can see the full schema.

Only `alembic/env.py` imports this; application code gets `Base` from
`app.db.base_class` to avoid circular imports.
"""

from app.db.base_class import Base  # noqa: F401
from app.models.admin_user import AdminUser  # noqa: F401
from app.models.category import Category  # noqa: F401
from app.models.contact_message import ContactMessage  # noqa: F401
from app.models.order import Order  # noqa: F401
from app.models.order_item import OrderItem  # noqa: F401
from app.models.product import Product, ProductCategory  # noqa: F401
