from pydantic import BaseModel


class Strip(BaseModel):
    id: int
    data: str
