from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class DocumentRequest(BaseModel):
    filename: str = Field(..., min_length=1, max_length=512)
    size_bytes: int = Field(..., gt=0)
    mime_type: str = Field(default="application/pdf")


class DocumentResponse(BaseModel):
    id: UUID
    user_id: str
    filename: str
    original_filename: str
    size_bytes: int
    mime_type: str
    s3_key: str
    pdf_type: Optional[str] = None
    page_count: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UploadUrlResponse(BaseModel):
    upload_url: str
    document_id: UUID
    fields: dict = Field(default_factory=dict)


class PaginatedDocumentsResponse(BaseModel):
    items: list[DocumentResponse]
    total: int
    page: int
    page_size: int
    pages: int
