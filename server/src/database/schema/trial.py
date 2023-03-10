from pydantic import BaseModel, Field
from src.database.interfaces import Document
from src.database.fields import Req, Opt
from src.database.validators import Val
from src.database.types import ImmutableList
from .comment import Comment


class LMSRatio(BaseModel):
    l: float | None
    m: float | None
    s: float | None


class Metadata(BaseModel):
    """Nested document to hold numerical trial data."""

    lmsRatio: LMSRatio = Field(default_factory=LMSRatio)
    jitter: float | None


class Raw(BaseModel):
    """Raw data that is immediately available on disk."""

    stripRaw: list[str] = Field(default=[])
    stripRawOutput: list[str] = Field(default=[])
    rasterize: str | None
    trajectory: str | None
    desinusoidLUT: str | None
    tcaCorrection: str | None


class Processed(BaseModel):
    """Processed data that is not immediately available."""

    desin: list[str] = Field(default=[])


####################
#       Main       #
####################
class Trial(Document,
            Req.Path,
            Opt.Rank,
            Val.FolderExists):
    metadata: Metadata = Field(default_factory=Metadata)
    raw: Raw = Field(default_factory=Raw)
    processed: Processed = Field(default_factory=Processed)
    comments: ImmutableList[Comment] = Field(default_factory=ImmutableList)
