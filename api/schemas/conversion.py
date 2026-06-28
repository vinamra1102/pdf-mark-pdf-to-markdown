from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class ConversionRequest(BaseModel):
    pass


class ConversionResponse(BaseModel):
    id: UUID
    document_id: UUID
    user_id: str
    status: str
    pdf_type: Optional[str] = None
    markdown_content: Optional[str] = None
    page_count: Optional[int] = None
    processing_time_ms: Optional[int] = None
    error_message: Optional[str] = None
    s3_result_key: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ConversionDetailResponse(ConversionResponse):
    document: Optional["DocumentResponse"] = None


class PaginatedConversionsResponse(BaseModel):
    items: list[ConversionResponse]
    total: int
    page: int
    page_size: int
    pages: int


class ConversionStatsResponse(BaseModel):
    total_documents: int
    total_conversions: int
    completed_conversions: int
    failed_conversions: int
    total_processing_time_ms: int


from schemas.document import DocumentResponse
ConversionDetailResponse.model_rebuild()
