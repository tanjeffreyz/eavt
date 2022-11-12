from pathlib import Path
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from src.common import config, utils
from src.database.schema import Trial, Session
from .models import CreateTrialRq, CreateSessionRq
from src.api.interfaces import QueryRq, QueryRs
from src.api.utils import get_document_by_id, get_query_page, update_model

router = APIRouter(prefix='/sessions')


#########################
#       Sessions        #
#########################
@router.get(
    '/query/{field}',
    response_description='Lists all sessions ordered by a single field',
    response_model=QueryRs[Session]
)
async def list_sessions_by_single_field(rq: Request, field: str, order: int = -1, cursor: str = 'null', limit: int = 100):
    query_requests = [QueryRq(field=field, order=order)]
    return get_query_page(rq.app.db['sessions'], query_requests, cursor, limit)


@router.post(
    '/query',
    response_description='Performs a query on multiple fields across all sessions',
    response_model=QueryRs[Session]
)
async def query_sessions_by_multiple_fields(rq: Request, body: list[QueryRq], cursor: str = 'null', limit: int = 100):
    return get_query_page(rq.app.db['sessions'], body, cursor, limit)


@router.post(
    '',
    status_code=status.HTTP_201_CREATED,
    response_description='Create a new session',
    response_model=Session
)
async def create_new_session(rq: Request, body: CreateSessionRq):
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


@router.patch(
    '/{session_id}',
    status_code=status.HTTP_200_OK,
    response_description='Patches the session with new information',
    response_model=Session
)
async def update_session(rq: Request, session_id: str, body: Session):
    old_session = Session(**get_document_by_id(rq.app.db['sessions'], session_id))
    new_session = update_model(old_session, body.dict())
    rq.app.db['sessions'].replace_one(
        {'_id': session_id},
        jsonable_encoder(new_session)
    )

    return rq.app.db['sessions'].find_one({'_id': session_id})


#####################################
#       Trials Within Sessions      #
#####################################
# @router.get(
#     '/{session_id}/trials',
#     status_code=status.HTTP_200_OK,
#     response_description='List all trials within the session',
#     response_model=ListTrialsRs
# )
async def list_trials_within_session(rq: Request, session_id: str, cursor: str = 'null', limit: int = 100):
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
    return rq.app.db['trials'].find_one({'_id': db_trial.inserted_id})
