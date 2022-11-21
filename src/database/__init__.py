"""Extend boilerplate functionality of Pydantic"""

import pydantic
from src.database.types import Immutable


# Set up Pydantic arbitrary type-casting
class NewBaseModel(pydantic.BaseModel):
    @pydantic.validator('*')
    def force_type(cls, v, field):
        if v is None:
            return None
        try:
            # Cast Immutable types
            if issubclass(field.outer_type_, Immutable):
                return field.outer_type_(v)
        except:
            pass
        return v


pydantic.BaseModel = NewBaseModel
