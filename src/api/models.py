import uuid
from enum import Enum
from pydantic import BaseModel, Field


#########################
#        Common         #
#########################
class Document(BaseModel):
    """Base model for all MongoDB documents"""

    id: str = Field(default_factory=uuid.uuid4, alias='_id')


class Flag(str, Enum):
    NONE = 'none'
    STAR = 'star'
    ERROR = 'error'


class Frame(Document):
    path: str
    flag: Flag


from fastapi.encoders import jsonable_encoder
f = Frame(path='asdf', flag=Flag.NONE)
json = jsonable_encoder(f)
print(json)


#########################
#       Sessions        #
#########################
class Session(Document):
    name: str
    path: str


#########################
#        Trials         #
#########################
class Trial(Document):
    name: str
    path: str
    desin: list[Frame]

