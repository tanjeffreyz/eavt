from fastapi import APIRouter, Request, status
from fastapi.encoders import jsonable_encoder
from src.api.utils import get_document_by_id, parse_trial, update_model
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
