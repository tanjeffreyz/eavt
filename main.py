import uvicorn
import logging
from fastapi import FastAPI
from fastapi.logger import logger
from pymongo import MongoClient
from src.common import config
from src.api import add_routes


app = FastAPI()


@app.on_event('startup')
def connect_db():
    app.db_client = MongoClient(config.DB.URI)
    app.db = app.db_client[config.DB.NAME]
    logger.info(f'Connected to database: {config.DB.NAME} @ {config.DB.URI}')


@app.on_event('shutdown')
def connect_db():
    app.db_client.close()


# Initialize API routes
add_routes(app)

# Set up logging
uvicorn_logger = logging.getLogger('uvicorn')
logger.handlers = uvicorn_logger.handlers
logger.setLevel(logging.DEBUG)

if __name__ == '__main__':
    # Start server
    uvicorn.run(
        'main:app',
        host=config.API.HOST,
        port=config.API.PORT,
        reload=True
    )
