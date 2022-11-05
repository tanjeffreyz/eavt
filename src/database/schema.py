from uuid import uuid4
from enum import Enum, auto
from pydantic import BaseModel, Field


#########################
#        Common         #
#########################
class Flag(str, Enum):
    """States to mark and highlight specific documents."""

    NONE = 'null'
    STAR = 'star'
    ERROR = 'error'


class Rank(int, Enum):
    """Indicates which types of accounts can view a document."""

    LOW = auto()         # Anyone can view
    MEDIUM = auto()      # Viewable by select guests
    HIGH = auto()        # Only viewable by us


class Document(BaseModel):
    """Base model for all MongoDB documents"""

    # Random ID for MongoDB
    id: str = Field(default_factory=uuid4, alias='_id')        # Aliases are only used when converting to JSON

    # Path to document from OZ.ROOT
    path: str

    # User-set flag to mark interesting/unusual documents
    flag: Flag = Field(default=Flag.NONE)


#########################
#        Trials         #
#########################
class Frame(Document):      # TODO: does granularity need to include individual frames?
    ...


class Trial(Document):
    # Parent session
    session: str

    # Decides who is able to view this document
    rank: Rank = Field(default=Rank.HIGH)

    # Comments specific to this trial
    comments: list[str] = Field(default=[])


#########################
#       Sessions        #
#########################
class Session(Document):
    # Decides who is able to view this document
    rank: Rank = Field(default=Rank.HIGH)

    # List of trial IDs in this session
    trials: list[str] = Field(default=[])

    # Comments specific to this session
    comments: list[str] = Field(default=[])
