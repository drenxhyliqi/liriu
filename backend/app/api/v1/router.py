from fastapi import APIRouter

from app.api.v1.endpoints import auth, categories, contact, health, orders, products, uploads, variants

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(variants.router, prefix="/variants", tags=["variants"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
