"""Common request/response templates used across various endpoints"""

from pydantic import BaseModel
from pydantic.generics import GenericModel
from typing import TypeVar, Generic


T = TypeVar('T')


class QueryRq(BaseModel):
    field: str
    order: int = -1
    min: float | int | str | None       # Pydantic casts the value in this exact order
    max: float | int | str | None       # Strings can cast anything, so put those last!
    eq: float | int | str | None


class PageRs(GenericModel, Generic[T]):
    """One page of data from an endpoint that supports pagination."""

    documents: list[T]
    cursor: float | int | str | None
    hasNext: bool
