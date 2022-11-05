from pydantic import BaseModel, Field
from src.database.schema import Session, Trial
from src.database.interfaces import Req, Opt


class CreateSessionRq(Req.Path):
    subjects: list[str]
    comments: list[str] = Field(default=[])


class CreateTrialRq(Req.Path):
    ...


class ListSessionsRs(BaseModel):
    sessions: list[Session]
    cursor: str | None


class ListTrialsRs(BaseModel):
    trials: list[Trial]
    cursor: str | None
