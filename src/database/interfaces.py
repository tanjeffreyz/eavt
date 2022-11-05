from uuid import uuid4
from datetime import datetime
from enum import Enum, auto
from pydantic import BaseModel, Field, validator
from fastapi import HTTPException, status
from src.common import utils


#####################
#       Enums       #
#####################
class Flag(str, Enum):
    """States to mark and highlight specific documents."""

    STAR = 'star'
    ERROR = 'error'


class Rank(int, Enum):
    """Indicates which types of accounts can view a document."""

    LOW = auto()         # Anyone can view
    MEDIUM = auto()      # Viewable by select guests
    HIGH = auto()        # Only viewable by us


#########################
#       Interfaces      #
#########################
class Req:
    """Attributes that must be present in the schema."""

    class ID(BaseModel):
        """Random unique ID for MongoDB"""

        id: str = Field(default_factory=uuid4, alias='_id')  # Aliases are only used when converting to JSON

    class Path(BaseModel):
        """Make sure all path references actually exist on disk."""

        path: str

        @validator('path')
        def path_exists(cls, p):
            if not utils.path_exists(p):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f'Path does not exist in OZ.ROOT: {p}'
                )
            return p


class Opt:
    """Optional attributes that have default values."""

    class DateTime(BaseModel):
        dt: datetime = Field(default_factory=datetime.now)

    class Rank(BaseModel):
        """Decides who is able to view this document"""

        rank: Rank = Field(default=Rank.HIGH)

    class Flag(BaseModel):
        """User-set flag to mark interesting/unusual documents"""

        flag: Flag | None

    class Comments(BaseModel):
        comments: list[str] = Field(default=[])
