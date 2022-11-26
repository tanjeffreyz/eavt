"""Templates to standardize frequently-used fields across all Models."""

from pydantic import BaseModel, Field
from datetime import datetime
from src.database.types import Rank, Flag, ImmutableString


#############################
#       Required Fields     #
#############################
class Req:
    """Attributes that must be present in the schema."""

    class Path(BaseModel):
        path: ImmutableString


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

        flag: Flag = Field(default=Flag.NONE)
