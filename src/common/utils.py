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
    diff.pop('id', None)
    return model.copy(update=diff)
