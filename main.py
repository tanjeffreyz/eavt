from fastapi import FastAPI
from pymongo import MongoClient
from src.common import config


app = FastAPI()


@app.on_event('startup')
def connect_db():
    app.db_client = MongoClient(config.DB_URI)
    app.db = app.db_client[config.DB_NAME]
    print(f'Connected to database {config.DB_NAME}@{config.DB_URI}')


@app.on_event('shutdown')
def connect_db():
    app.db_client.close()
