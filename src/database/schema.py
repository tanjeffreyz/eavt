from pydantic import Field
from .interfaces import Required, Optional


#########################
#        Common         #
#########################
class Document(Required.ID, Required.Path, Optional.DateTime, Optional.Flag):
    """Base model for all MongoDB documents"""


#########################
#        Trials         #
#########################
class Frame(Document):      # TODO: does granularity need to include individual frames?
    """Reference to an image or cone JSON."""

    ...


class Trial(Document, Optional.Comments):
    # Parent session
    session: str


#########################
#       Sessions        #
#########################
class Session(Document, Optional.Comments):
    # List of trial IDs in this session
    trials: list[str] = Field(default=[])
