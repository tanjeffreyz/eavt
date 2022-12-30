from src.database.schema import Trial


class PatchTrialRq(Trial):
    body: str | None
    path: str | None
