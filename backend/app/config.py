import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

class Settings(BaseSettings):
    database_url: str
    google_client_id: str
    google_client_secret: str
    jwt_secret: str

def _require(key: str) -> str:
    value = os.getenv(key)
    if value is None:
        raise RuntimeError(f"Missing required env var: {key}")
    return value

settings = Settings(
    database_url=_require("DATABASE_URL"),
    google_client_id=_require("GOOGLE_CLIENT_ID"),
    google_client_secret=_require("GOOGLE_CLIENT_SECRET"),
    jwt_secret=_require("JWT_SECRET"),
)