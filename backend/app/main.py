from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.limiter import limiter


def _rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"detail": "Shumë kërkesa. Provoni përsëri pas pak."},
    )


# In production the interactive docs and OpenAPI schema are turned off so the
# full admin API surface isn't handed to anyone who visits /docs.
_docs_enabled = not settings.is_production
app = FastAPI(
    title=settings.PROJECT_NAME,
    docs_url="/docs" if _docs_enabled else None,
    redoc_url="/redoc" if _docs_enabled else None,
    openapi_url="/openapi.json" if _docs_enabled else None,
)

# Rate limiting (see app/core/limiter.py). Routes opt in with
# @limiter.limit(...); exceeding a limit raises RateLimitExceeded, which the
# handler below turns into a 429.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)

Path(settings.MEDIA_DIR).mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=settings.MEDIA_DIR), name="media")


@app.get("/")
def root() -> dict:
    return {"name": settings.PROJECT_NAME, "docs": "/docs" if _docs_enabled else None}
