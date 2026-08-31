from fastapi import APIRouter, Depends, Query

from app.api.deps import get_current_admin
from app.models.admin_user import AdminUser
from app.schemas.upload import UploadSignature
from app.services.cloudinary import generate_upload_signature

router = APIRouter()

_ALLOWED_FOLDERS = {"products", "variants"}


@router.get("/signature", response_model=UploadSignature)
def get_upload_signature(
    target: str = Query(description="'products' or 'variants' - which asset folder this upload belongs in"),
    _admin: AdminUser = Depends(get_current_admin),
) -> UploadSignature:
    """The admin UI calls this right before showing Cloudinary's upload
    widget (or before a plain signed POST), then uploads directly to
    Cloudinary with the returned signature - the image bytes never hit
    this API. Once Cloudinary responds, the admin UI PATCHes the resulting
    `secure_url`/`public_id` onto the product/variant via
    PATCH /products/{id} or /variants/{id}.
    """
    folder = target if target in _ALLOWED_FOLDERS else "misc"
    return generate_upload_signature(folder=f"liriu/{folder}")
