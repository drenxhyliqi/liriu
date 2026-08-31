"""Imports every model so Alembic's autogenerate can see the full schema.

This module exists purely as a single import point for `alembic/env.py`
(`from app.db.base import Base`) - it is not imported by application code,
which gets `Base` from `app.db.base_class` directly to avoid the circular
import that having models import it from here would cause.
"""

from app.db.base_class import Base  # noqa: F401
from app.models.admin_user import AdminUser  # noqa: F401
from app.models.category import Category  # noqa: F401
from app.models.contact_message import ContactMessage  # noqa: F401
from app.models.order import Order  # noqa: F401
from app.models.order_item import OrderItem  # noqa: F401
from app.models.product import Product  # noqa: F401
from app.models.product_variant import ProductVariant  # noqa: F401
