from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# `future=True`/2.0-style engine. Not created lazily on purpose - connecting
# only happens on first actual query (SQLAlchemy's engine is a connection
# pool factory, not a live connection), so importing this module - and the
# whole app - never requires Postgres to be reachable.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
