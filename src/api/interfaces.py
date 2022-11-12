"""Common request/response templates used across various endpoints"""

from pydantic import BaseModel


class Query(BaseModel):
    field: str
    order: int = -1
    min: str | float | int | None
    max: str | float | int | None
