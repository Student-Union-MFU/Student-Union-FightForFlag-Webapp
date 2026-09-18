from app.logging_config import logging
from app.logging_config import setup_logging

setup_logging()
logger = logging.getLogger(__name__)