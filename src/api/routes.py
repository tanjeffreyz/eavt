"""The core API. Routes requests to their appropriate handlers."""

from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from src.api.models import Session


router = APIRouter()


@router.post('/session', response_description='Create a new session')
def create_session(request: Request, session: Session = Body(...)):
    session = jsonable_encoder(session)
    new_session = request.app.db['sessions'].insert_one(session)
    created_session = request.app.db['sessions'].find_one(
        {'_id': new_session.inserted_id}
    )
    return created_session


@router.post('/session/{sid}/trial', response_description='Create a new trial')
def create_trial():
    ...

