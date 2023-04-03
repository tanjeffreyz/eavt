from pydantic import BaseModel, Field


class RetinaStrip(BaseModel):
    id: int
    data: str


class MicrodoseStrip(BaseModel):
    id: int
    microdoses: list = Field(default=[])
    intensities: list = Field(default=[])
