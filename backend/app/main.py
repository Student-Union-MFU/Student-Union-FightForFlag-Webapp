from fastapi import FastAPI
from app.db import get_db
from starlette.middleware.sessions import SessionMiddleware
from app.config import settings
from starlette.middleware.sessions import SessionMiddleware
from app.config import settings
from app.routers import auth
from app.routers import user
from app.routers import vote
from app.scripts.seedschools import seed_schools
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
database = get_db()

# if database:
#     seed_schools()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://172.25.4.133",
        "https://student-union-fight-for-flag-webapp.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware, 
    secret_key=settings.jwt_secret,
    same_site="lax",
    https_only=False
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(vote.router)

@app.get("/")
def a():
    return {"message": "Fight For Flag API"}

@app.get("/api/backend/")
def root():
    return {"message": "Fight For Flag API"}