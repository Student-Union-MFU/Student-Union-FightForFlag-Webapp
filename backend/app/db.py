from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.logger import logger
from models.base import Base

if not settings.database_url:
    raise RuntimeError("DATABASE_URL is not set")

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine)

logger.info("Database is running now")
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()