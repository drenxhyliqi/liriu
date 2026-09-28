from typing import Generic, TypeVar

from app.schemas.base import CamelModel

T = TypeVar("T")


class Page(CamelModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
