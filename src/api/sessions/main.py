from fastapi import APIRouter, Body, Request, status
from fastapi.encoders import jsonable_encoder
from src.database.schema import Session
from .models import *


router = APIRouter(prefix='/session')


@router.post(
    '/',
    status_code=status.HTTP_201_CREATED,
    response_description='Created a new session',
    response_model=Session
)
def create_session(rq: Request, body: CreateSessionRq):
    new_session = Session(
        **jsonable_encoder(body)
    )
    new_document = jsonable_encoder(new_session)
    db_session = rq.app.db['sessions'].insert_one(new_document)
    created_session = rq.app.db['sessions'].find_one(
        {'_id': db_session.inserted_id}
    )
    return created_session


@router.post(
    '/{session_id}/trial',
    status_code=status.HTTP_201_CREATED,
    response_description='Created a new trial within existing session'
)
def create_trial_within_session(rq: Request, session_id: str):
    print(session_id)

