from pydantic import BaseModel, Field
from src.database.schema import Session, Trial
from src.database.interfaces import Req, Opt


class CreateSessionRq(Req.Path, Opt.DateTime):
    subjects: list[str]
    comments: list[str] = Field(default=[])


class CreateTrialRq(Req.Path, Opt.DateTime):
    ...


class ListSessionsRs(BaseModel):
    sessions: list[Session]
    cursor: str | None


class ListTrialsRs(BaseModel):
    trials: list[Trial]
    cursor: str | None
