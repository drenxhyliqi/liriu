from fastapi import APIRouter, Depends, File, UploadFile

from app.api.deps import get_current_admin
from app.schemas.base import CamelModel
from app.services.media import save_image

router = APIRouter(dependencies=[Depends(get_current_admin)])


class UploadResult(CamelModel):
    url: str


@router.post("", response_model=UploadResult)
async def upload_image(file: UploadFile = File(...)) -> UploadResult:
    return UploadResult(url=await save_image(file))
