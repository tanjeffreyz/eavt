from pathlib import Path
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from src.common import config, utils
from src.database.schema import Trial, Session
from .models import CreateTrialRq, CreateSessionRq, ListTrialsRs, ListSessionsRs


router = APIRouter(prefix='/sessions')


#########################
#       Sessions        #
#########################
@router.get(
    '/',
    response_description='List a page of sessions',
    response_model=ListSessionsRs
)
def list_sessions(rq: Request, cursor: str = 'null', limit: int = 100):
    # TODO: maintain order
    # IDs are naturally sorted in descending order, so paginate towards lower IDs
    id_query = ({} if cursor == 'null' else {'id': {'$lt': cursor}})
    sessions = list(rq.app.db['sessions'].find(id_query, limit=limit))
    next_cursor = (None if len(sessions) < limit else sessions[-1]['_id'])

    # Response dict is used as parameters for ListSessionsRs and validated
    return {
        'sessions': sessions,
        'cursor': next_cursor
    }


@router.post(
    '/',
    status_code=status.HTTP_201_CREATED,
    response_description='Create a new session',
    response_model=Session
)
def create_session(rq: Request, body: CreateSessionRq):
    # Check for duplicate in database
    if rq.app.db['sessions'].find_one({'folder': body.folder}) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Session already exists in database: {body.folder}"
        )

    # Create the session folder and document
    utils.get_path(body.folder).mkdir(exist_ok=True)
    new_session = Session(**jsonable_encoder(body))

    # Add to database
    new_document = jsonable_encoder(new_session)
    db_session = rq.app.db['sessions'].insert_one(new_document)

    # Return document as response
    return rq.app.db['sessions'].find_one({'_id': db_session.inserted_id})


#####################################
#       Trials Within Sessions      #
#####################################
@router.get(
    '/{session_id}/trials',
    status_code=status.HTTP_200_OK,
    response_description='List all trials within the session',
    response_model=ListTrialsRs
)
def list_trials_within_session(rq: Request, session_id: str, cursor: str = 'null', limit: int = 100):
    # TODO: maintain order
    session = get_session_from_id(rq, session_id)
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
    session = get_session_from_id(rq, session_id)
    if rq.app.db['trials'].find_one({'folder': body.folder}) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Trial already exists in database: {body.folder}"
        )

    # Check that session is strictly a prefix of trial folder
    s_path = Path(config.OZ.ROOT, session['folder'])
    t_path = Path(config.OZ.ROOT, body.folder)
    if t_path.samefile(s_path) or s_path not in t_path.parents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trial does not belong to this session: {body.folder}"
        )

    # Create new trial and add it to the database
    new_trial = Trial(
        **jsonable_encoder(body),
        parent_id=session['_id']
    )
    db_trial = rq.app.db['trials'].insert_one(jsonable_encoder(new_trial))

    # Attach trial ID to parent session
    rq.app.db['sessions'].update_one(
        {'_id': session['_id']},
        {'$push': {'trials': db_trial.inserted_id}}
    )

    # Return document as response
    return rq.app.db['trials'].find_one({'_id': db_trial.inserted_id})


#############################
#       Helper Methods      #
#############################
def get_session_from_id(rq: Request, session_id: str):
    if (session := rq.app.db['sessions'].find_one({'_id': session_id})) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Session ID does not exist: {session_id}"
        )
    return session
