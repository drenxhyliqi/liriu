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

    # Cloudinary. Product/variant images are uploaded directly from the
    # admin UI to Cloudinary (the API only issues a signed upload
    # signature - see services/cloudinary.py) so large image bytes never
    # transit this server.
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
