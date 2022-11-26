from src.database.schema import Session
from src.database.fields import Req


class CreateSessionRq(Req.Path):
    subject: str


class PatchSessionRq(Session):
    body: str | None
    path: str | None
