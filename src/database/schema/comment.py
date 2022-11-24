from src.database.types import ImmutableString
from src.database.interfaces import Document


class Comment(Document):
    author: ImmutableString | None
    subject: str
    body: str
