from pydantic import BaseModel


class Strip(BaseModel):
    n: int
    data: str
