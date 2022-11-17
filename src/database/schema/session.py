from pydantic import Field
from src.database.interfaces import Document
from src.database.fields import Req, Opt
from src.database.validators import Val
from src.database.types import ImmutableList


class Session(Document,     # TODO: validate folder length/depth = 1
              Req.Path,
              Opt.Rank, Opt.Comments,
              Val.FolderExists):
    # List of trial IDs in this session
    trials: ImmutableList = Field(default_factory=ImmutableList)
