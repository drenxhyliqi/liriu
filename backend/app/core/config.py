from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central config, read from environment / .env.

    Nothing here has a "real" default for secrets or credentials - those
    must come from the environment (docker-compose's env_file, or a local
    .env for non-Docker dev). The defaults that do exist (project name,
    API prefix, token expiry) are structural, not sensitive.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "NSH LIRIU API"
    API_V1_PREFIX: str = "/api/v1"

    # Postgres. In docker-compose this points at the `db` service; for
    # local (non-Docker) dev, point it at a local Postgres instance.
    DATABASE_URL: str = "postgresql+psycopg2://liriu:liriu@localhost:5432/liriu"

    # Comma-separated list of origins allowed to call this API. The Next.js
    # site (dev and prod) needs to be listed here once it starts calling
    # this backend instead of its local static data / route handlers.
    CORS_ORIGINS: str = "http://localhost:3000"

    # Admin auth (JWT). SECRET_KEY has no safe default - every deployment
    # must set its own via the environment.
    SECRET_KEY: str = "change-me-in-env"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 12

    # Uploaded images are stored on disk under MEDIA_DIR and served at
    # /media/... In production MEDIA_DIR must be a persistent volume.
    MEDIA_DIR: str = "media"

    # New-order email notifications via Resend (https://resend.com). With no
    # API key, orders are still saved - the email is just skipped (logged).
    RESEND_API_KEY: str = ""
    # Comma-separated. Replace with the company's own address once its domain is set up.
    ORDER_NOTIFY_EMAILS: str = "xhyliqiidren@gmail.com"
    # Resend only sends from domains verified in the Resend account. Until the
    # company domain is verified, onboarding@resend.dev works - but only to the
    # email address the Resend account was created with.
    MAIL_FROM: str = "NSH LIRIU <onboarding@resend.dev>"
    # Public address of the Next.js site, for "open in dashboard" links and images.
    SITE_URL: str = "http://localhost:3000"

    @property
    def order_notify_list(self) -> list[str]:
        return [e.strip() for e in self.ORDER_NOTIFY_EMAILS.split(",") if e.strip()]

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


_PLACEHOLDER_SECRET = "change-me-in-env"


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if settings.SECRET_KEY == _PLACEHOLDER_SECRET or len(settings.SECRET_KEY) < 32:
        # Anyone who knows the key can mint admin tokens - never run with the example value.
        raise RuntimeError(
            "SECRET_KEY is missing or too short. Set it in backend/.env: "
            'python -c "import secrets; print(secrets.token_hex(32))"'
        )
    return settings


settings = get_settings()
