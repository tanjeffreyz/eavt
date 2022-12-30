from pathlib import Path
from src.common import config


def abs_path(path) -> Path:
    return Path(config.OZ.ROOT, path)


def rel_path(path, root=config.OZ.ROOT) -> Path:
    return Path(path).relative_to(root)


def is_folder(path):
    return abs_path(path).is_dir()


def is_file(path):
    return abs_path(path).is_file()
