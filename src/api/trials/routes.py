from fastapi import APIRouter, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from src.common import utils
from src.database.schema import Trial


router = APIRouter(prefix='/trials')


@router.put(
    '/{trial_id}',
    status_code=status.HTTP_200_OK,
    response_description='Reindexes the trial',
    response_model=Trial
)
def reindex_trial(rq: Request, trial_id: str):
    old_trial = Trial(**get_trial_from_id(rq, trial_id))
    new_trial = utils.update_model(old_trial, {'id': 'asdf'})      # TODO
    db_trial = rq.app.db['trials'].replace_one(
        {'_id': trial_id},
        jsonable_encoder(new_trial)
    )
    print(db_trial.upserted_id)

    # Return document as response
    return rq.app.db['trials'].find_one({'_id': trial_id})


#############################
#       Helper Methods      #
#############################
def get_trial_from_id(rq: Request, trial_id: str):
    if (trial := rq.app.db['trials'].find_one({'_id': trial_id})) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trial ID does not exist: {trial_id}"
        )
    return trial
