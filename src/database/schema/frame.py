from src.database.interfaces import Document
from src.database.fields import Req
from src.database.validators import Val


class Frame(Document,
            Req.Path,
            Val.FileExists):      # TODO: does granularity need to include individual frames?
    """Queryable Reference to a single image or microdose frame"""
