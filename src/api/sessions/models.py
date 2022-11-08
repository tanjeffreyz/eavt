from pydantic import BaseModel, Field
from src.database.schema.trial import Trial
from src.database.schema.session import Session
from src.database.interfaces import Req


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
