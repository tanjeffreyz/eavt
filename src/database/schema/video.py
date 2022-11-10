from pydantic import Field
from src.database.interfaces import Document
from src.database.schema.frame import Frame
from src.database.fields import Req
from src.database.validators import Val


class Video(Document,
            Req.Path,
            Val.FolderExists):     # TODO: still not sure if we need this, can just store list of frames in trial
    """A list of Frames that share a folder and comprise a video"""

    frames: list[Frame] = Field(default=[])
