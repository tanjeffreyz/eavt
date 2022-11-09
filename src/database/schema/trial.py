from pydantic import BaseModel, Field
from src.database.interfaces import Document
from src.database.schema.video import Video
from src.database.fields import Req, Opt
from src.database.validators import Val


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
class Trial(Document,
            Req.Folder,
            Opt.Rank, Opt.Comments,
            Val.FolderExists):
    data: TrialData = Field(default_factory=TrialData)
    microdoses: Video | None
    strips: Video | None
