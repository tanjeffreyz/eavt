from pathlib import Path
from src.common import config


def path_exists(path):
    """Returns whether PATH exists relative to the Oz root."""

    return Path(config.OZ.ROOT, path).exists()
