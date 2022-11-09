from pathlib import Path
from pydantic import BaseModel
from src.common import config


def get_path(path: str) -> Path:
    """PATH is relative to OZ.ROOT, returns a Path object of the absolute path"""

    return Path(config.OZ.ROOT, path)


def is_folder(path: str):
    return get_path(path).is_dir()


def is_file(path: str):
    return get_path(path).is_file()


def update_model(model: BaseModel, diff: dict):
    """Updates the model using the given differences, recurses on submodels"""

    assert type(diff) == dict, f'Diff must be a dictionary: {diff}'
    if len(diff) == 0:
        return model

    for key, value in diff.items():
        if key == 'id' or not hasattr(model, key):
            continue    # Enforce Pydantic schema, ignore keys not in current model
        if isinstance((sub := getattr(model, key)), BaseModel):
            value = update_model(sub, diff[key])     # Recurse on nested models
        setattr(model, key, value)
    return model
