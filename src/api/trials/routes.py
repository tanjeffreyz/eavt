from fastapi import APIRouter, Request, status
from fastapi.encoders import jsonable_encoder
from src.api.utils import get_document_by_id, parse_trial, update_model, get_query_page
from src.api.interfaces import QueryRq, QueryRs
from src.database.schema import Trial


router = APIRouter(prefix='/trials')


@router.put(
    '/{trial_id}',
    status_code=status.HTTP_200_OK,
    response_description='Reindexes the trial',
    response_model=Trial
)
def reindex_trial(rq: Request, trial_id: str):
    old_trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    diff = parse_trial(old_trial.path)
    new_trial = update_model(old_trial, diff)
    rq.app.db['trials'].replace_one(
        {'_id': trial_id},
        jsonable_encoder(new_trial)
    )

    return rq.app.db['trials'].find_one({'_id': trial_id})


@router.patch(
    '/{trial_id}',
    status_code=status.HTTP_200_OK,
    response_description='Patches the trial with new information',
    response_model=Trial
)
def update_trial(rq: Request, trial_id: str, body: Trial):
    old_trial = Trial(**get_document_by_id(rq.app.db['trials'], trial_id))
    new_trial = update_model(old_trial, body.dict())
    rq.app.db['trials'].replace_one(
        {'_id': trial_id},
        jsonable_encoder(new_trial)
    )

    return rq.app.db['trials'].find_one({'_id': trial_id})


@router.get(
    '/query/{field}',
    response_description='Lists all trials ordered by a single field',
    response_model=QueryRs[Trial]
)
def list_trials_by_single_field(rq: Request, field: str, order: int = -1, cursor: str = 'null', limit: int = 100):
    query_requests = [QueryRq(field=field, order=order)]
    return get_query_page(rq.app.db['trials'], query_requests, cursor, limit)


@router.post(
    '/query',
    response_description='Performs a query on multiple fields across all trials',
    response_model=QueryRs[Trial]
)
def query_trials_by_multiple_fields(rq: Request, body: list[QueryRq], cursor: str = 'null', limit: int = 100):
    return get_query_page(rq.app.db['trials'], body, cursor, limit)
