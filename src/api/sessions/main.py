from pathlib import Path
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from src.database.schema import Session, Trial
from src.common import config
from .models import *


router = APIRouter(prefix='/session')


@router.post(
    '/',
    status_code=status.HTTP_201_CREATED,
    response_description='Created a new session',
    response_model=Session
)
def create_session(rq: Request, body: CreateSessionRq):
    # Check for duplicates
    if rq.app.db['sessions'].find_one({'path': body.path}) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Session already exists: {body.path}"
        )

    # Create new session      TODO: server can create folders?
    new_session = Session(**jsonable_encoder(body))

    # Add to database
    new_document = jsonable_encoder(new_session)
    db_session = rq.app.db['sessions'].insert_one(new_document)

    # Return document as response
    return rq.app.db['sessions'].find_one(
        {'_id': db_session.inserted_id}
    )


@router.get(
    '/',
    response_description='Listed a page of sessions',
    response_model=ListSessionsRs
)
def list_sessions(rq: Request, cursor: str = 'null', limit: int = 100):
    # ID's are naturally sorted in descending order, so paginate towards lower IDs
    id_query = ({} if cursor == 'null' else {'id': {'$lt': cursor}})
    sessions = list(rq.app.db['sessions'].find(id_query, limit=limit))
    next_cursor = (None if len(sessions) < limit else sessions[-1]['_id'])

    # Response dict is used as parameters for ListSessionsRs and validated
    return {
        'sessions': sessions,
        'cursor': next_cursor
    }


@router.post(
    '/{session_id}/trial',
    status_code=status.HTTP_201_CREATED,
    response_description='Created a new trial within existing session',
    response_model=Trial
)
def create_trial_within_session(rq: Request, session_id: str, body: CreateTrialRq):
    if (session := rq.app.db['sessions'].find_one({'_id': session_id})) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Session ID does not exist: {session_id}"
        )
    if rq.app.db['trials'].find_one({'path': body.path}) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Trial already exists: {body.path}"
        )
    s_path = Path(config.OZ.ROOT, session['path'])
    t_path = Path(config.OZ.ROOT, body.path)
    if t_path.samefile(s_path) or s_path not in t_path.parents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trial does not belong to this session: {body.path}"
        )

    # Create new trial and add it to the database
    new_trial = Trial(
        **jsonable_encoder(body),
        session=session['_id']
    )
    new_document = jsonable_encoder(new_trial)
    db_trial = rq.app.db['trials'].insert_one(new_document)

    # Attach trial ID to parent session
    rq.app.db['sessions'].update_one(
        {'_id': session['_id']},
        {'$push': {'trials': db_trial.inserted_id}}
    )

    # Return document as response
    return rq.app.db['trials'].find_one(
        {'_id': db_trial.inserted_id}
    )
