from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter()


@router.get("")
def health(db: Session = Depends(get_db)) -> dict:
    """Confirms both the API process and its Postgres connection are up -
    what docker-compose / a load balancer would poll.
    """
    db.execute(text("SELECT 1"))
    return {"status": "ok"}
