from pydantic import BaseModel, validator
from fastapi import HTTPException, status
from pathlib import Path
from src.common import utils


class Val:
    class FileExists(BaseModel):
        """Makes sure all file references actually exist on disk."""

        @validator('path', check_fields=False)
        def file_exists(cls, p):
            if not utils.is_file(p):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f'File does not exist in OZ.ROOT: {p}'
                )
            return p

    class FolderExists(BaseModel):
        """Makes sure all folder references actually exist on disk."""

        @validator('path', check_fields=False)
        def folder_exists(cls, p):
            if not utils.is_folder(p):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f'Folder does not exist in OZ.ROOT: {p}'
                )
            return p

    @staticmethod
    def PathDepth(depth):
        class PathDepthValidator(BaseModel):
            @validator('path', check_fields=False, allow_reuse=True)
            def valid_path_depth(cls, p):
                if len(Path(p).parents) != depth:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f'Path is not of depth {depth}: {p}'
                    )
                return p
        return PathDepthValidator
