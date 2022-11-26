from fastapi import APIRouter, Request, status
from fastapi.encoders import jsonable_encoder
from src.api.utils import get_document_by_id
from src.database.schema import Session, Comment


router = APIRouter(
    prefix='/sessions',
    tags=['Session Data']
)


#########################
#       Comments        #
#########################
@router.post(
    '/{session_id}/comments',
    status_code=status.HTTP_201_CREATED,
    description='Adds a new comment to this session',
    response_model=Session
)
async def add_comment_to_session(rq: Request, session_id: str, body: Comment):
    session = Session(**get_document_by_id(rq.app.db['sessions'], session_id))
    rq.app.db['sessions'].update_one(
        {'_id': session.id},
        {'$push': {'comments': jsonable_encoder(body)}}
    )
    return get_document_by_id(rq.app.db['sessions'], session_id)


@router.patch(
    '/{session_id}/comments/{comment_id}',
    description='Updates a comment within this session',
    response_model=Session
)
async def update_session_comment(rq: Request, session_id: str, comment_id: str, body: Comment):
    session = Session(**get_document_by_id(rq.app.db['sessions'], session_id))
    rq.app.db['sessions'].update_one(
        {'_id': session.id, 'comments._id': comment_id},
        {'$set': {
            'comments.$.subject': body.subject,
            'comments.$.body': body.body
        }}
    )
    return get_document_by_id(rq.app.db['sessions'], session_id)


@router.delete(
    '/{session_id}/comments/{comment_id}',
    description='Deletes the comment from this session',
    response_model=Session
)
async def delete_comment_from_session(rq: Request, session_id: str, comment_id: str):
    session = Session(**get_document_by_id(rq.app.db['sessions'], session_id))
    rq.app.db['sessions'].update_one(
        {'_id': session.id},
        {'$pull': {'comments': {'_id': comment_id}}}
    )
    return get_document_by_id(rq.app.db['sessions'], session_id)
