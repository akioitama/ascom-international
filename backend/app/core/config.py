from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "ASCOM International API"
    environment: str = "development"
    secret_key: str = "dev-only-change-me"
    access_token_expire_hours: int = 12
    database_url: str = "postgresql+psycopg://ascom:ascom@localhost:5432/ascom"
    cors_origins: str = "http://localhost:3000"
    admin_email: str = "admin@ascomintl.com"
    admin_password: str = "change-this-password"
    admin_name: str = "ASCOM Administrator"
    upload_dir: str = "uploads"
    max_upload_mb: int = 8
    seed_on_startup: bool = True
    log_level: str = "INFO"

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


settings = Settings()
