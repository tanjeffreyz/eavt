import tarfile
from base64 import b64encode
from src.common import utils
from fastapi import APIRouter, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from src.api.utils import get_document_by_id
from src.api.interfaces import PageRs, Cursor
from src.database.schema import Trial, Comment
from .models import Strip


router = APIRouter(
    prefix='/trials',
    tags=['Trial Data']
)


#########################
#       Raw Data        #
#########################
@router.get(
    '/{trial_id}/raw/strip-raw',
    description='Retrieves raw strip data from the trial',
    response_model=PageRs[Strip]
)
async def get_strip_raw(rq: Request, trial_id: str, cursor: str = Cursor.NULL, limit: int = 100):
    trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    if (tars := trial.raw.stripRaw) is None or len(tars) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No raw strip data associated with trial: {trial.path}"
        )
    return get_tar_page(tars, cursor, limit)


@router.get(
    '/{trial_id}/raw/strip-raw-output',
    description='Retrieves raw strip output data from the trial',
    response_model=PageRs[Strip]
)
async def get_strip_raw_output(rq: Request, trial_id: str, cursor: str = Cursor.NULL, limit: int = 100):
    trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    if (tars := trial.raw.stripRawOutput) is None or len(tars) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No raw strip output data associated with trial: {trial.path}"
        )
    return get_tar_page(tars, cursor, limit)


#########################
#       Comments        #
#########################
@router.post(
    '/{trial_id}/comments',
    status_code=status.HTTP_201_CREATED,
    description='Adds a new comment to this trial',
    response_model=Trial
)
async def add_comment_to_trial(rq: Request, trial_id: str, body: Comment):
    trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    rq.app.db['trials'].update_one(
        {'_id': trial.id},
        {'$push': {'comments': jsonable_encoder(body)}}
    )
    return get_document_by_id(rq.app.db['trials'], trial_id)


@router.delete(
    '/{trial_id}/comments/{comment_id}',
    description='Deletes the comment from this trial',
    response_model=Trial
)
async def delete_comment_from_trial(rq: Request, trial_id: str, comment_id: str):
    trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    rq.app.db['trials'].update_one(
        {'_id': trial.id},
        {'$pull': {'comments': {'_id': comment_id}}}
    )
    return get_document_by_id(rq.app.db['trials'], trial_id)


#############################
#       Helper Methods      #
#############################
def get_tar_page(tars, cursor, limit):      # TODO: generalize to all image types
    # Retrieve last state from cursor, making sure it is a valid cursor
    if cursor == Cursor.NULL:
        t = 0       # Which .tar to start from
        f = -1      # Which file in the .tar to start from
    else:
        vals = cursor.split(',', 1)
        try:
            t, f = int(vals[0]), int(vals[1])
        except (IndexError, ValueError):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cursor must consist of exactly 2 comma-separated integers"
            )

    remaining = limit
    documents = []
    while remaining > 0 and t < len(tars):
        with tarfile.open(utils.abs_path(tars[t]), 'r') as tar:
            members = tar.getmembers()
            start = f + 1

            # Add file contents to documents
            for m in members[start:start + remaining]:
                new_strip = Strip(
                    n=int(m.name.split('.', 1)[0]),
                    data=b64encode(tar.extractfile(m).read())
                )
                documents.append(new_strip)

            # Continue pagination
            f = start + remaining - 1
            remaining = limit - len(documents)
            if f + 1 >= len(members):
                t += 1
                f = -1
    has_next = (t < len(tars))
    next_cursor = f'{t},{f}' if has_next else None

    return {
        'documents': documents,
        'cursor': next_cursor,
        'hasNext': has_next
    }
