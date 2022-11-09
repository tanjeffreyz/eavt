from pydantic import BaseModel, Field
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

    HIGH = auto()  # Only viewable by us
    MEDIUM = auto()      # Viewable by select guests
    LOW = auto()  # Anyone can view


#################################
#       Common Attributes       #
#################################
class Req:
    """Attributes that must be present in the schema."""

    class File(BaseModel):
        file: str

    class Folder(BaseModel):
        folder: str


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
