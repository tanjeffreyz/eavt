from src.database.fields import Req


class CreateSessionRq(Req.Path):
    subject: str
