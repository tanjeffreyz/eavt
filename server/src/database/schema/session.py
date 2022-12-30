from pydantic import Field
from src.database.interfaces import Document
from src.database.fields import Req, Opt
from src.database.validators import Val
from src.database.types import ImmutableList
from .comment import Comment


class Session(Document,
              Req.Path,
              Opt.Rank,
              Val.FolderExists):
    trials: ImmutableList[str] = Field(default_factory=ImmutableList)
    comments: ImmutableList[Comment] = Field(default_factory=ImmutableList)
