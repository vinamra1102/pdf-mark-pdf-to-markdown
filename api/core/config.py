from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "PDFMark API"
    debug: bool = False
    api_prefix: str = "/api/v1"

    database_url: str = "postgresql+asyncpg://pdfmark:pdfmark_secret@localhost:5432/pdfmark"
    redis_url: str = "redis://localhost:6379/0"

    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    clerk_jwks_url: str = "https://api.clerk.com/v1/jwks"
    clerk_issuer: str = ""

    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    aws_s3_bucket: str = "pdfmark-uploads"
    aws_endpoint_url: Optional[str] = None

    max_upload_size_bytes: int = 100 * 1024 * 1024

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
