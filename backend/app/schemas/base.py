from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Every schema in this API is JSON-camelCase on the wire (groupName,
    productSlug, createdAt, ...) to match the conventions already used
    throughout the Next.js frontend/types (src/types/index.ts) - so wiring
    the frontend to this API later is a straight fetch-and-use, no field
    renaming. `populate_by_name` also accepts snake_case, so constructing
    these from Python (e.g. `OrderRead.model_validate(order)`) still works
    with the ORM's snake_case attribute names.
    """

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
