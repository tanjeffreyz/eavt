import tarfile
from src.common import utils
from fastapi import APIRouter, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from src.api.utils import get_document_by_id, parse_trial, update_model, get_query_page
from src.api.interfaces import QueryRq, PageRs
from src.database.schema import Trial


router = APIRouter(
    prefix='/trials',
    tags=['Trial Data']
)


#############################
#       Get Trial Data      #
#############################
@router.get(
    '/{trial_id}/raw/strip-raw',
    description='Retrieves raw strip data from the trial'
)
async def get_strip_raw(rq: Request, trial_id: str, cursor: str = 'null', limit: int = 100):
    trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    if (tars := trial.raw.stripRaw) is None or len(tars) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No raw strip data associated with trial: {trial.path}"
        )

    # Retrieve last state from cursor
    if cursor == 'null':
        t = 0       # Which .tar to start from
        f = -1      # Which file in the .tar to start from
    else:
        vals = cursor.split('|')
        t, f = int(vals[0]), int(vals[1])

    remaining = limit
    frames = []
    while remaining > 0 and t < len(tars):
        with tarfile.open(utils.abs_path(tars[t]), 'r') as file:
            members = file.getmembers()
            start = f + 1
            frames += members[start:start+remaining]
            f = start + remaining - 1
            remaining = limit - len(frames)
            if f + 1 >= len(members):
                t += 1
                f = -1
    has_next = (t < len(tars))
    next_cursor = f'{t}|{f}' if has_next else None

    print(len(frames))
    print(t, f)
