from src.database.fields import ImmutableString
from pathlib import Path
from pydantic import BaseModel
from src.common import config


def abs_path(path) -> Path:
    return Path(config.OZ.ROOT, path)


def rel_path(path, root=config.OZ.ROOT) -> Path:
    return Path(path).relative_to(root)


def is_folder(path):
    return abs_path(path).is_dir()


def is_file(path):
    return abs_path(path).is_file()


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


def parse_trial(path):
    root = abs_path(path)
    strip_raw_output = root / 'strip_raw_output'
    rasterize = root / 'rasterize'
    trajectory = root / 'trajectory'

    raw = {
        'stripRawOutput': [str(rel_path(x)) for x in strip_raw_output.glob('**/*.tar')],
        'rasterize': str(rel_path(next(rasterize.glob('*.txt')))),
        'trajectory': str(rel_path(next(trajectory.glob('*.txt')))),
        'tcaCorrection': str(rel_path(root / 'tca_correction.json')),
        'desinusoidLUT': str(rel_path(root / 'desinusoid.lut'))
    }
    return {'raw': raw}
