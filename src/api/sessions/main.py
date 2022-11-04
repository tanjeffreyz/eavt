from fastapi import APIRouter, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from src.database.schema import Session, Trial
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
    if rq.app.db['sessions'].find_one({'_id': body.id}) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Session already exists: {body.id}"
        )

    # Create session and add to database
    new_session = Session(**jsonable_encoder(body))
    new_document = jsonable_encoder(new_session)
    db_session = rq.app.db['sessions'].insert_one(new_document)

    # Return document as response
    created_session = rq.app.db['sessions'].find_one(
        {'_id': db_session.inserted_id}
    )
    return created_session


@router.post(
    '/{session_id}/trial',
    status_code=status.HTTP_201_CREATED,
    response_description='Created a new trial within existing session',
    response_model=Trial
)
def create_trial_within_session(rq: Request, session_id: str):
    print(session_id)

