from uuid import uuid4
from pydantic import Field
from src.database.fields import Opt


#########################
#       Interfaces      #
#########################
class Document(Opt.DateTime, Opt.Flag):
    """
    Queryable base model for all documents that take part in a tree structure.
    Each type of Document, like Session or Trial, is stored in its own collection.
    """

    # Random unique ID required by MongoDB
    id: str = Field(default_factory=uuid4, alias='_id')     # Aliases are only used when converting to JSON

    parent_id: str | None
