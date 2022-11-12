from fastapi import HTTPException, Request, status
from pydantic import BaseModel
from src.common.utils import abs_path, rel_path
from src.database.types import ImmutableString
from src.api.interfaces import QueryRq


def update_model(model: BaseModel, diff: dict):
    """Updates the model using the given differences, recurses on submodels"""

    assert type(diff) == dict, f'Diff must be a dictionary: {diff}'
    if len(diff) == 0:
        return model

    for key, value in diff.items():
        if not hasattr(model, key):
            continue    # Enforce Pydantic schema, ignore keys not in current model
        field = getattr(model, key)
        if isinstance(field, ImmutableString):
            continue    # Cannot change immutable fields
        if isinstance(field, BaseModel):
            value = update_model(field, diff[key])     # Recurse on nested models
        setattr(model, key, value)
    return model


def get_all_paths(path, match):
    return [str(rel_path(x)) for x in path.glob(match)]


def get_first_path(path, match):
    try:
        return str(rel_path(next(path.glob(match))))
    except StopIteration:
        return None


def parse_trial(path):
    # Get file paths
    root = abs_path(path)
    tca_correction_path = str(rel_path(p)) if (p := root / 'tca_correction.json').exists() else None
    desinusoid_path = str(rel_path(p)) if (p := root / 'desinusoid.lut').exists() else None

    raw = {
        'stripRawOutput': get_all_paths(root / 'strip_raw_output', '**/*.tar'),
        'rasterize': get_first_path(root / 'rasterize', '*.txt'),
        'trajectory': get_first_path(root / 'trajectory', '*.txt'),
        'tcaCorrection': tca_correction_path,
        'desinusoidLUT': desinusoid_path
    }

    return {'raw': raw}


def get_document_by_id(collection, _id: str):
    if (result := collection.find_one({'_id': _id})) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Trial ID does not exist: {_id}"
        )
    return result


def get_query_page(collection, field, order, cursor, limit, body: list[QueryRq]):
    """Returns a page of results from the given query starting at CURSOR."""

    # Prepare primary field's query
    query = {field: {'$exists': True}}
    if cursor != 'null':
        # If in DECREASING order (negative), return the next few items that are BELOW the cursor
        # If in INCREASING order (positive), return the next few items that are ABOVE the cursor
        comparator = ('$lt' if order < 0 else '$gt')
        query[field][comparator] = cursor
    sort = [(field, order)]

    # Additional queries specified by user
    for q in body:
        subquery = {'$exists': True}
        if q.min is not None:
            subquery['$gte'] = q.min
        if q.max is not None:
            subquery['$lte'] = q.max
        query[q.field] = subquery
        sort.append((q.field, q.order))

    print(query)

    # Execute queries
    documents = list(
        collection
        .find(query)
        .sort(sort)
        .limit(limit + 1)       # Try getting 1 more to check for leftovers
    )

    # Get pointers for future pagination
    has_next = (len(documents) > limit)
    documents = documents[:limit]
    next_cursor = (documents[-1][field] if has_next else None)

    # Response dict is used as parameters for QueryRs and validated
    return {
        'documents': documents,
        'cursor': next_cursor,
        'hasNext': has_next
    }
