import boto3
from botocore.config import Config as BotoConfig
from typing import Optional
import uuid

from core.config import settings

_s3_client: Optional[boto3.client] = None


def get_s3_client() -> boto3.client:
    global _s3_client
    if _s3_client is None:
        kwargs = {
            "service_name": "s3",
            "region_name": settings.aws_region,
            "aws_access_key_id": settings.aws_access_key_id,
            "aws_secret_access_key": settings.aws_secret_access_key,
            "config": BotoConfig(signature_version="s3v4"),
        }
        if settings.aws_endpoint_url:
            kwargs["endpoint_url"] = settings.aws_endpoint_url
        _s3_client = boto3.client(**kwargs)
    return _s3_client


def generate_s3_key(user_id: str, filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "pdf"
    unique_id = uuid.uuid4().hex
    return f"uploads/{user_id}/{unique_id}.{ext}"


def generate_result_s3_key(user_id: str, document_id: str) -> str:
    return f"results/{user_id}/{document_id}.md"


def generate_presigned_upload_url(s3_key: str, content_type: str = "application/pdf", expiration: int = 3600) -> str:
    client = get_s3_client()
    url = client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": settings.aws_s3_bucket,
            "Key": s3_key,
            "ContentType": content_type,
        },
        ExpiresIn=expiration,
    )
    return url


def generate_presigned_download_url(s3_key: str, expiration: int = 3600) -> str:
    client = get_s3_client()
    url = client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.aws_s3_bucket, "Key": s3_key},
        ExpiresIn=expiration,
    )
    return url


def upload_file_to_s3(file_content: bytes, s3_key: str, content_type: str = "application/pdf") -> None:
    client = get_s3_client()
    client.put_object(
        Bucket=settings.aws_s3_bucket,
        Key=s3_key,
        Body=file_content,
        ContentType=content_type,
    )


def download_file_from_s3(s3_key: str) -> bytes:
    client = get_s3_client()
    response = client.get_object(Bucket=settings.aws_s3_bucket, Key=s3_key)
    return response["Body"].read()


def delete_file_from_s3(s3_key: str) -> None:
    client = get_s3_client()
    client.delete_object(Bucket=settings.aws_s3_bucket, Key=s3_key)
