from src.database.types import ImmutableString
from src.database.fields import Opt


class Comment(Opt.DateTime):
    author: ImmutableString | None
    body: str
