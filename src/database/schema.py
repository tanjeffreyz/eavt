from pydantic import Field
from .interfaces import Req, Opt


#########################
#        Common         #
#########################
class Document(Req.ID, Req.Path, Opt.DateTime, Opt.Flag):
    """Base model for all MongoDB documents"""


#########################
#        Trials         #
#########################
class Frame(Document):      # TODO: does granularity need to include individual frames?
    """Reference to an image or cone JSON."""

    ...


class Trial(Document, Opt.Rank, Opt.Comments):
    # Parent session
    session: str


#########################
#       Sessions        #
#########################
class Session(Document, Opt.Rank, Opt.Comments):
    # List of trial IDs in this session
    trials: list[str] = Field(default=[])
