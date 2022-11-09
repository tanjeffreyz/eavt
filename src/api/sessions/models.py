from pydantic import BaseModel
from src.database.schema.trial import Trial
from src.database.schema.session import Session
from src.database.fields import Req


class CreateSessionRq(Req.Folder):
    subject: str


class CreateTrialRq(Req.Folder):
    pass


class ListSessionsRs(BaseModel):
    sessions: list[Session]
    cursor: str | None


class ListTrialsRs(BaseModel):
    trials: list[Trial]
    cursor: str | None
