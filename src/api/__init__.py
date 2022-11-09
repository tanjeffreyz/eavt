from src.common import config
from .sessions.routes import router as sessions_router
from .trials.routes import router as trials_router


ROUTERS = (
    sessions_router,
    trials_router
)


def add_routes(app):
    for router in ROUTERS:
        app.include_router(router, prefix=config.API.PREFIX)
