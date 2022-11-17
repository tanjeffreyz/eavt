from fastapi import APIRouter, Request, status
from fastapi.encoders import jsonable_encoder
from src.api.utils import get_document_by_id, parse_trial, update_model, get_query_page
from src.api.interfaces import QueryRq, QueryRs
from src.database.schema import Trial


router = APIRouter(
    prefix='/trials',
    tags=['Trial Data']
)


#############################
#       Get Trial Data      #
#############################
@router.get(
    '/{trial_id}/data/strip-raw-output'
)
async def get_strip_raw_output():
    pass
