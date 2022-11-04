from enum import Enum
from pydantic import BaseModel, Field


#########################
#        Common         #
#########################
class Flag(str, Enum):
    """States to mark and highlight specific documents."""

    NONE = 'none'
    STAR = 'star'
    ERROR = 'error'


class Document(BaseModel):
    """Base model for all MongoDB documents"""

    # Client defined unique ID, path to document from root
    id: str = Field(alias='_id')        # Aliases are only used when converting to JSON

    flag: Flag = Field(default=Flag.NONE)


class Frame(Document):
    ...


#########################
#       Sessions        #
#########################
class Session(Document):
    comments: list[str] = Field(default=[])


#########################
#        Trials         #
#########################
class Trial(Document):
    desin: list[Frame]
