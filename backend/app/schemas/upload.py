from app.schemas.base import CamelModel


class UploadSignature(CamelModel):
    """What the admin UI needs to upload an image directly to Cloudinary
    from the browser (via Cloudinary's upload widget or a plain signed
    POST), without the image bytes ever passing through this API. See
    services/cloudinary.py.
    """

    timestamp: int
    signature: str
    api_key: str
    cloud_name: str
    folder: str
