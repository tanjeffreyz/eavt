"""Common request/response templates used across various endpoints"""

from pydantic import BaseModel
from pydantic.generics import GenericModel
from typing import TypeVar, Generic


T = TypeVar('T')


class QueryRq(BaseModel):
    field: str
    order: int = -1
    min: str | float | int | None
    max: str | float | int | None
    eq: str | float | int | None


class QueryRs(GenericModel, Generic[T]):
    documents: list[T]
    cursor: str | None
    hasNext: bool
