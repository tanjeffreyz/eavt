from src.common import config
from .sessions.routes import router as sessions_router
from .session_data.routes import router as session_data_router
from .trials_within_session.routes import router as trials_within_session_router
from .trials.routes import router as trials_router
from .trial_data.routes import router as trial_data_router


ROUTERS = (
    sessions_router,
    session_data_router,
    trials_within_session_router,
    trials_router,
    trial_data_router
)


def add_routes(app):
    for router in ROUTERS:
        app.include_router(router, prefix=config.API.PREFIX)
