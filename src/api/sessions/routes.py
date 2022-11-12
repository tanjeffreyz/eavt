from pathlib import Path
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from src.common import config, utils
from src.database.schema import Trial, Session
from .models import CreateTrialRq, CreateSessionRq
from src.api.interfaces import QueryRs
from src.api.utils import get_document_by_id, get_query_page

router = APIRouter(prefix='/sessions')


#########################
#       Sessions        #
#########################
@router.get(
    '/{field}',
    response_description='List Sessions',
    response_model=QueryRs[Session]
)
def list_sessions_ordered_by_field(rq: Request, field: str, order: int = -1, cursor: str = 'null', limit: int = 100):
    return get_query_page(rq.app.db['sessions'], field, order, cursor, limit, [])


@router.post(
    '/',
    status_code=status.HTTP_201_CREATED,
    response_description='Create a new session',
    response_model=Session
)
def create_session(rq: Request, body: CreateSessionRq):
    # Check for duplicate in database
    if rq.app.db['sessions'].find_one({'path': body.path}) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Session already exists in database: {body.path}"
        )

    # Create the session folder and document
    utils.abs_path(body.path).mkdir(exist_ok=True)
    new_session = Session(**jsonable_encoder(body))

    # Add to database
    new_document = jsonable_encoder(new_session)
    db_session = rq.app.db['sessions'].insert_one(new_document)

    # Return document as response
    return rq.app.db['sessions'].find_one({'_id': db_session.inserted_id})


#####################################
#       Trials Within Sessions      #
#####################################
# @router.get(
#     '/{session_id}/trials',
#     status_code=status.HTTP_200_OK,
#     response_description='List all trials within the session',
#     response_model=ListTrialsRs
# )
def list_trials_within_session(rq: Request, session_id: str, cursor: str = 'null', limit: int = 100):
    # TODO: maintain order
    session = get_document_by_id(rq.app.db['sessions'], session_id)
    if cursor == 'null':
        query = {}
    else:
        query = {
            'parent_id': session_id,
            '_id': {'$lt': cursor},
        }
    trials = list(rq.app.db['trials'].find(query, limit=limit))
    next_cursor = (None if len(trials) < limit else trials[-1]['_id'])
    return {
        'trials': trials,
        'cursor': next_cursor
    }


@router.post(
    '/{session_id}/trials',
    status_code=status.HTTP_200_OK,
    response_description='Create a new trial within existing session',
    response_model=Trial
)
def create_trial_within_session(rq: Request, session_id: str, body: CreateTrialRq):
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
    return rq.app.db['trials'].find_one({'_id': db_trial.inserted_id})
