from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.config import settings
from app.db import get_db

from app.routers import auth
from app.routers import user
from app.routers import vote
from app.routers import eventsetting
from app.routers import admin


app = FastAPI()

database = get_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://172.25.4.133",
        "https://student-union-fight-for-flag-webapp.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(
    SessionMiddleware,
    secret_key=settings.jwt_secret,
    same_site="lax",
    https_only=False,
)


app.include_router(
    auth.router,
    prefix="/api/backend",
)

app.include_router(
    user.router,
    prefix="/api/backend",
)

app.include_router(
    vote.router,
    prefix="/api/backend",
)

app.include_router(
    eventsetting.router,
    prefix="/api/backend",
)

app.include_router(
    admin.router,
    prefix="/api/backend",
)


@app.get("/")
def root():
    return {
        "message": "Fight For Flag API"
    }


@app.get("/api/backend/")
def backend_root():
    return {
        "message": "Fight For Flag API"
    }


print("\n=== REGISTERED ROUTES ===")

for route in app.routes:
    path = getattr(route, "path", None)
    methods = getattr(route, "methods", None)

    if path:
        print(path, methods)

print("=========================\n")