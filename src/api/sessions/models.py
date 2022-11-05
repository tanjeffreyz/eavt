from pydantic import BaseModel, Field
from src.database.schema import Session, Trial
from ..interfaces import Required, Optional


class CreateSessionRq(Required.Path, Optional.DateTime):
    subjects: list[str]
    comments: list[str] = Field(default=[])


class CreateTrialRq(Required.Path, Optional.DateTime):
    ...


class ListSessionsRs(BaseModel):
    sessions: list[Session]
    cursor: str | None


class ListTrialsRs(BaseModel):
    trials: list[Trial]
    cursor: str | None
