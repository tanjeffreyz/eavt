from src.database.interfaces import Document
from src.database.fields import Imm
from src.database.validators import Val


class Frame(Document,
            Imm.Path,
            Val.FileExists):      # TODO: does granularity need to include individual frames?
    """Queryable Reference to a single image or microdose frame"""
