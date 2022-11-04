"""Global namespaces shared by multiple modules."""


class DB:
    URI = 'mongodb://localhost:27017'
    NAME = 'oz'


class API:
    HOST = 'localhost'
    PORT = 1939
    PREFIX = '/api'
