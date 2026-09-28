import io
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps, UnidentifiedImageError

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.category import Category
from app.models.order_item import OrderItem
from app.models.product import Product

MAX_UPLOAD_BYTES = 15 * 1024 * 1024
MAX_SIDE = 1600
# Guards against decompression bombs (a tiny file that expands to gigapixels).
Image.MAX_IMAGE_PIXELS = 60_000_000

MEDIA_ROOT = Path(settings.MEDIA_DIR)
# Stored and returned as a root-relative path. The Next.js app proxies
# /media/* to this API, so the same URL works in every environment.
MEDIA_URL_PREFIX = "/media/"


def _public_url(relative: str) -> str:
    return f"{MEDIA_URL_PREFIX}{relative}"


async def save_image(upload: UploadFile) -> str:
    """Stores an uploaded image as a compressed WebP (max 1600px, transparency
    kept) and returns its URL path.
    """
    data = await upload.read(MAX_UPLOAD_BYTES + 1)
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Imazhi është më i madh se 15 MB.")

    try:
        image = Image.open(io.BytesIO(data))
        image.load()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Skedari nuk është një imazh i vlefshëm.")

    image = ImageOps.exif_transpose(image)
    has_alpha = image.mode in ("RGBA", "LA", "PA") or (image.mode == "P" and "transparency" in image.info)
    image = image.convert("RGBA" if has_alpha else "RGB")
    image.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)

    now = datetime.now(timezone.utc)
    relative = f"uploads/{now:%Y/%m}/{uuid.uuid4().hex}.webp"
    target = MEDIA_ROOT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "WEBP", quality=82, method=6)
    return _public_url(relative)


def delete_if_unused(db: Session, url: str | None) -> None:
    """Deletes an uploaded file once nothing references it any more. Order
    items count as references, so a quote request keeps its images even after
    the product's photo is replaced. Images bundled with the frontend
    (paths like /signs/...) are never touched.
    """
    prefix = _public_url("uploads/")
    if not url or not url.startswith(prefix):
        return
    in_use = (
        db.query(Product.id).filter(Product.image_url == url).first()
        or db.query(Category.id).filter(Category.image_url == url).first()
        or db.query(OrderItem.id).filter(OrderItem.image_url == url).first()
    )
    if in_use:
        return
    path = (MEDIA_ROOT / url[len(MEDIA_URL_PREFIX):]).resolve()
    if MEDIA_ROOT.resolve() in path.parents and path.is_file():
        path.unlink()


