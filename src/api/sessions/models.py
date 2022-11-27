from src.database.schema import Session
from src.database.fields import Req
from src.database.validators import Val


class CreateSessionRq(Req.Path, Val.PathDepth(1)):
    subject: str


class PatchSessionRq(Session):
    body: str | None
    path: str | None
