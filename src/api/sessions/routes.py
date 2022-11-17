from fastapi import APIRouter, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from src.common import utils
from src.database.schema import Session
from .models import CreateSessionRq
from src.api.interfaces import QueryRq, PageRs
from src.api.utils import get_document_by_id, get_query_page, update_model

router = APIRouter(
    prefix='/sessions',
    tags=['Sessions']
)


#########################
#       Sessions        #
#########################
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


#############################
#       Query Sessions      #
#############################
@router.get(
    '/query/{field}',
    response_description='Lists all sessions ordered by a single field',
    response_model=PageRs[Session]
)
async def list_sessions_by_single_field(rq: Request, field: str, order: int = -1, cursor: str = 'null', limit: int = 100):
    query_requests = [QueryRq(field=field, order=order)]
    return get_query_page(rq.app.db['sessions'], query_requests, cursor, limit)


@router.post(
    '/query',
    response_description='Performs a query on multiple fields across all sessions',
    response_model=PageRs[Session]
)
async def query_sessions_by_multiple_fields(rq: Request, body: list[QueryRq], cursor: str = 'null', limit: int = 100):
    return get_query_page(rq.app.db['sessions'], body, cursor, limit)
