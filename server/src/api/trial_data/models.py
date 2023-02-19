from pydantic import BaseModel


class RetinaStrip(BaseModel):
    id: int
    data: str


class MicrodoseStrip(BaseModel):
    id: int
    data: list
