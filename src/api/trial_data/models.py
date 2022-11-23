from pydantic import BaseModel


class Strip(BaseModel):
    name: int
    data: str
