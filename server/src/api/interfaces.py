"""Common request/response templates used across various endpoints"""

from fastapi import HTTPException, status
from pydantic import BaseModel, Field
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


class Cursor:
    NULL = 'null'

    @staticmethod
    def validate_type(cursor, kind):
        if type(cursor) != kind:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cursor must either be a '{kind}'"
            )
