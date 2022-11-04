from datetime import datetime
from pydantic import BaseModel, Field


class Required:
    class ID(BaseModel):
        id: str = Field(alias='_id')


class Optional:
    class DateTime(BaseModel):
        dt: datetime = Field(default_factory=datetime.now)
