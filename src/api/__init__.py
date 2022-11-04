from src.common import config
from src.api.sessions import sessions_router


ROUTERS = (
    sessions_router,
)


def add_routes(app):
    for router in ROUTERS:
        app.include_router(router, prefix=config.API.PREFIX)
