import uvicorn
import logging
from fastapi import FastAPI
from fastapi.logger import logger
from pymongo import MongoClient
from src.common import config


app = FastAPI()


@app.on_event('startup')
def connect_db():
    app.db_client = MongoClient(config.DB.URI)
    app.db = app.db_client[config.DB.NAME]
    logger.info(f'Connected to database: {config.DB.NAME} @ {config.DB.URI}')


@app.on_event('shutdown')
def connect_db():
    app.db_client.close()


# Set up logging
uvicorn_logger = logging.getLogger('uvicorn')
logger.handlers = uvicorn_logger.handlers
logger.setLevel(logging.DEBUG)

# Start server
uvicorn.run(app, host=config.API.HOST, port=config.API.PORT)
