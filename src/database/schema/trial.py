from pydantic import BaseModel, Field
from src.database.interfaces import Node, Video, Opt


class LMSRatio(BaseModel):
    l: float | None
    m: float | None
    s: float | None


class TrialData(BaseModel):
    """Nested document to hold numerical trial data."""

    lmsRatio: LMSRatio = Field(default_factory=LMSRatio)
    jitter: float | None


####################
#       Main       #
####################
class Trial(Node, Opt.Rank, Opt.Comments):
    data: TrialData = Field(default_factory=TrialData)
    microdoses: Video | None
    strips: Video | None
