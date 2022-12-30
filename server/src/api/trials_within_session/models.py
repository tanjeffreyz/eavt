from src.database.fields import Req
from src.database.validators import Val


class CreateTrialRq(Req.Path, Val.PathDepth(5)):
    pass
