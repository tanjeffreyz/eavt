from datetime import datetime
from pydantic import BaseModel, Field, validator
from fastapi import HTTPException, status
from src.common import utils


class Required:
    class Path(BaseModel):
        path: str

        @validator('path')
        def path_exists(cls, p):
            """Make sure all path references actually exist on disk."""

            if not utils.path_exists(p):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f'Path does not exist in OZ.ROOT: {p}'
                )
            return p


class Optional:
    class DateTime(BaseModel):
        dt: datetime = Field(default_factory=datetime.now)
