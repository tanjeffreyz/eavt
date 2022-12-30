from pathlib import Path
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from src.common import config
from src.database.schema import Trial, Session
from .models import CreateTrialRq
from src.api.interfaces import PageRs, Cursor
from src.api.utils import get_document_by_id, get_documents_by_ids


router = APIRouter(
    prefix='/sessions',
    tags=['Trials Within Session']
)


#############################
#       Creating Trials     #
#############################
@router.post(       # TODO: create folder as well, or leave that up to Wizard?
    '/{session_id}/trials',
    description='Create a new trial within existing session',
    response_model=Trial
)
async def create_new_trial_within_session(rq: Request, session_id: str, body: CreateTrialRq):
    # Check that trial does not already exist in database
    session = Session(**get_document_by_id(rq.app.db['sessions'], session_id))
    if rq.app.db['trials'].find_one({'path': body.path}) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Trial already exists in database: {body.path}"
        )

    # Check that session is strictly a prefix of trial folder
    s_path = Path(config.OZ.ROOT, session.path)
    t_path = Path(config.OZ.ROOT, body.path)
    if not t_path.exists():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trial path does not exist: {body.path}"
        )
    if t_path.samefile(s_path) or s_path not in t_path.parents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trial does not belong to this session: {body.path}"
        )

    # Create new trial and add it to the database
    new_trial = Trial(
        **jsonable_encoder(body),
        parent_id=session.id
    )
    db_trial = rq.app.db['trials'].insert_one(jsonable_encoder(new_trial))

    # Attach trial ID to parent session
    rq.app.db['sessions'].update_one(
        {'_id': session.id},
        {'$push': {'trials': db_trial.inserted_id}}
    )

    # Return document as response
    return get_document_by_id(rq.app.db['trials'], db_trial.inserted_id)


#############################
#       List Trials        #
#############################
@router.get(
    '/{session_id}/trials',
    description='List all trials within the session',
    response_model=PageRs[Trial]
)
async def list_trials_within_session(rq: Request, session_id: str, cursor: int | str = Cursor.NULL, limit: int = 50):
    if cursor == Cursor.NULL:
        cursor = -1
    elif type(cursor) != int:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cursor must either be '{Cursor.NULL}' or an integer >= -1"
        )
    if cursor < -1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cursor must be at least -1"
        )
    session = Session(**get_document_by_id(rq.app.db['sessions'], session_id))

    start = cursor + 1
    end = start + limit
    trial_ids = session.trials[start:end]
    trials = get_documents_by_ids(rq.app.db['trials'], trial_ids)

    has_next = (end < len(session.trials))
    next_cursor = (end - 1) if has_next else None

    return {
        'documents': trials,
        'cursor': next_cursor,
        'hasNext': has_next
    }
