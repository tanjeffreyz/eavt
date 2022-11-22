from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from src.api.utils import get_document_by_id, parse_trial, update_model, get_query_page
from src.api.interfaces import QueryRq, PageRs, Cursor
from src.database.schema import Trial


router = APIRouter(
    prefix='/trials',
    tags=['Trials']
)


#############################
#       Query Trials        #
#############################
@router.get(
    '/query',
    description='Lists all trials ordered by a single field',
    response_model=PageRs[Trial]
)
async def list_trials_by_single_field(rq: Request, field: str, order: int = -1, cursor: str = Cursor.NULL, limit: int = 100):
    query_requests = [QueryRq(field=field, order=order)]
    return get_query_page(rq.app.db['trials'], query_requests, cursor, limit)


@router.post(
    '/query',
    description='Performs a query on multiple fields across all trials',
    response_model=PageRs[Trial]
)
async def query_trials_by_multiple_fields(rq: Request, body: list[QueryRq], cursor: str = Cursor.NULL, limit: int = 100):
    return get_query_page(rq.app.db['trials'], body, cursor, limit)


#############################
#       Update Trials       #
#############################
@router.put(
    '/{trial_id}',
    description='Reindexes the trial',
    response_model=Trial
)
async def reindex_trial(rq: Request, trial_id: str):
    old_trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    diff = parse_trial(old_trial.path)
    new_trial = update_model(old_trial, diff)
    rq.app.db['trials'].replace_one(
        {'_id': trial_id},
        jsonable_encoder(new_trial)
    )

    return get_document_by_id(rq.app.db['trials'], trial_id)


@router.patch(
    '/{trial_id}',
    description='Patches the trial with new information',
    response_model=Trial
)
async def update_trial(rq: Request, trial_id: str, body: Trial):
    old_trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    new_trial = update_model(old_trial, body.dict())
    rq.app.db['trials'].replace_one(
        {'_id': trial_id},
        jsonable_encoder(new_trial)
    )

    return get_document_by_id(rq.app.db['trials'], trial_id)


@router.get(
    '/{trial_id}',
    description='Retrieves information about the trial',
    response_model=Trial
)
async def get_trial(rq: Request, trial_id: str):
    return get_document_by_id(rq.app.db['trials'], trial_id)
