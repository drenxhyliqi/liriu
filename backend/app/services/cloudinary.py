import time

import cloudinary
import cloudinary.uploader
import cloudinary.utils

from app.core.config import settings
from app.schemas.upload import UploadSignature

# Product/variant images are meant to go straight from the admin's browser
# to Cloudinary - not through this API - so a 10MB photo never has to
# transit our server twice (browser -> API -> Cloudinary). This module only
# ever handles the *signature* (so the upload is authenticated as coming
# from LIRIU's own admin, not an open/public upload preset) and asset
# deletion (which does need the API secret, so it can't happen client-side).

_configured = False


def _ensure_configured() -> None:
    global _configured
    if _configured:
        return
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )
    _configured = True


def generate_upload_signature(folder: str) -> UploadSignature:
    """`folder` should be e.g. "liriu/products" or "liriu/variants" so
    assets stay organized by what they belong to. The frontend passes this
    straight to Cloudinary's upload widget / API alongside the file.
    """
    _ensure_configured()
    timestamp = int(time.time())
    params_to_sign = {"timestamp": timestamp, "folder": folder}
    signature = cloudinary.utils.api_sign_request(params_to_sign, settings.CLOUDINARY_API_SECRET)
    return UploadSignature(
        timestamp=timestamp,
        signature=signature,
        api_key=settings.CLOUDINARY_API_KEY,
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        folder=folder,
    )


def delete_asset(public_id: str) -> None:
    """Called when a product/variant's image is replaced or the record is
    deleted, so orphaned assets don't pile up in the Cloudinary account.
    Not yet wired into the product/variant endpoints below - see
    backend/README.md workflow notes.
    """
    _ensure_configured()
    cloudinary.uploader.destroy(public_id)
