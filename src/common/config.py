"""Global namespaces shared by multiple modules."""

import os


class DB:
    URI = 'mongodb://localhost:27017'
    NAME = 'oz'


class API:
    HOST = 'localhost'
    PORT = 1939
    PREFIX = '/api'


class OZ:
    ROOT = os.environ['OZ_SESSIONS_HOME']
