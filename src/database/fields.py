from uuid import uuid4
from pydantic import BaseModel, Field, validator
from datetime import datetime
from enum import Enum, auto


#####################
#       Enums       #
#####################
class MediaType(str, Enum):
    JSON = 'json'
    PNG = 'png'


class Flag(str, Enum):
    """States to mark and highlight specific documents."""

    STAR = 'star'
    ERROR = 'error'


class Rank(int, Enum):
    """Indicates which types of accounts can view a document."""

    HIGHEST = auto()    # Only viewable by us
    HIGH = auto()
    MEDIUM = auto()     # Viewable by select guests
    LOW = auto()
    LOWEST = auto()     # Anyone can view


#############################
#       Required Fields     #
#############################
class Req:
    """Attributes that must be present in the schema."""

    class Path(BaseModel):
        path: str


#############################
#       Optional Fields     #
#############################
class Opt:
    """Optional attributes that have default values."""

    class DateTime(BaseModel):
        dt: datetime = Field(default_factory=datetime.now)

    class Rank(BaseModel):
        """Decides who is able to view this document"""

        rank: Rank = Field(default=Rank.HIGHEST)

    class Flag(BaseModel):
        """User-set flag to mark interesting/unusual documents"""

        flag: Flag | None

    class Comments(BaseModel):
        comments: list[str] = Field(default=[])


###############################
#       Immutable Fields      #
###############################
class Immutable(str):
    @staticmethod
    def validate(v):
        return None if v is None else Immutable(v)


class Imm:
    """String fields that cannot be changed once set"""

    class ID(BaseModel):
        """Random unique ID required by MongoDB"""

        id: Immutable = Field(
            default_factory=lambda: Immutable(uuid4()),
            alias='_id'       # Aliases are only used when converting to JSON
        )

        @validator('id')
        def to_immutable(cls, v):
            return Immutable.validate(v)

    class ParentID(BaseModel):
        """ID of this document's parent document"""

        parent_id: Immutable | None

        @validator('parent_id')
        def to_immutable(cls, v):
            return Immutable.validate(v)

    class Path(BaseModel):
        """The path referred to on disk"""

        path: Immutable

        @validator('path')
        def to_immutable(cls, v):
            return Immutable.validate(v)
