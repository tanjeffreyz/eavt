from pydantic import Field
from src.database.interfaces import Node, Opt


#####################
#       Main        #
#####################
class Session(Node, Opt.Rank, Opt.Comments):
    # List of trial IDs in this session
    trials: list[str] = Field(default=[])
