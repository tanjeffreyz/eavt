from ..interfaces import Required, Optional


class CreateSessionRq(Required.ID, Optional.DateTime):
    subjects: list[str]
    comments: list[str]
