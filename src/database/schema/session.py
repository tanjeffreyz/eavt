from pydantic import Field
from src.database.interfaces import Document
from src.database.fields import Req, Opt
from src.database.validators import Val


class Session(Document,     # TODO: validate folder length/depth = 1
              Req.Folder,
              Opt.Rank, Opt.Comments,
              Val.FolderExists):
    # List of trial IDs in this session
    trials: list[str] = Field(default=[])
