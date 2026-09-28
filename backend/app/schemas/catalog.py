from app.schemas.base import CamelModel


class CatalogCategory(CamelModel):
    id: int
    slug: str
    name: str
    description: str | None
    image_url: str | None
    image_fit: str
    parent_id: int | None
    sort_order: int


class Placement(CamelModel):
    category_id: int
    position: int


class CatalogProduct(CamelModel):
    id: int
    slug: str
    name: str
    description: str
    keywords: str
    image_url: str | None
    image_fit: str
    placements: list[Placement] = []


class Catalog(CamelModel):
    """Everything the public site needs in one response. The catalog is a few
    hundred rows, so the frontend fetches it once, caches it, and builds the
    tree, breadcrumbs and search pools locally.
    """

    categories: list[CatalogCategory]
    products: list[CatalogProduct]
