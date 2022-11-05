from pydantic import Field
from ..interfaces import Required, Optional


class CreateSessionRq(Required.Path, Optional.DateTime):
    subjects: list[str]
    comments: list[str] = Field(default=[])


class CreateTrialRq(Required.Path, Optional.DateTime):
    ...
