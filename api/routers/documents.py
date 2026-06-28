from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from math import ceil

from core.database import get_db, DocumentModel, ConversionModel
from core.auth import verify_clerk_token
from core.storage import generate_presigned_upload_url, generate_s3_key
from schemas.document import DocumentResponse, UploadUrlResponse, PaginatedDocumentsResponse

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload-url", response_model=UploadUrlResponse)
async def create_upload_url(
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    import uuid
    doc_id = uuid.uuid4()
    s3_key = generate_s3_key(user_id, "upload.pdf")
    upload_url = generate_presigned_upload_url(s3_key)

    document = DocumentModel(
        id=doc_id,
        user_id=user_id,
        filename=s3_key.split("/")[-1],
        original_filename="upload.pdf",
        size_bytes=0,
        mime_type="application/pdf",
        s3_key=s3_key,
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)

    return UploadUrlResponse(
        upload_url=upload_url,
        document_id=doc_id,
        fields={},
    )


@router.post("/upload/confirm", response_model=DocumentResponse)
async def confirm_upload(
    document_id: str,
    filename: str = Query(...),
    size_bytes: int = Query(...),
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    import uuid as uuid_mod
    doc_uuid = uuid_mod.UUID(document_id)
    result = await db.execute(select(DocumentModel).where(DocumentModel.id == doc_uuid, DocumentModel.user_id == user_id))
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.original_filename = filename
    doc.size_bytes = size_bytes
    doc.filename = f"{uuid_mod.uuid4().hex}_{filename}"
    await db.commit()
    await db.refresh(doc)

    return doc


@router.get("/", response_model=PaginatedDocumentsResponse)
async def list_documents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    count_result = await db.execute(
        select(func.count()).select_from(DocumentModel).where(DocumentModel.user_id == user_id)
    )
    total = count_result.scalar() or 0

    result = await db.execute(
        select(DocumentModel)
        .where(DocumentModel.user_id == user_id)
        .order_by(DocumentModel.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    documents = result.scalars().all()

    return PaginatedDocumentsResponse(
        items=[DocumentResponse.model_validate(d) for d in documents],
        total=total,
        page=page,
        page_size=page_size,
        pages=ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/stats", response_model=dict)
async def get_stats(
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    doc_count_result = await db.execute(
        select(func.count()).select_from(DocumentModel).where(DocumentModel.user_id == user_id)
    )
    total_docs = doc_count_result.scalar() or 0

    conv_count_result = await db.execute(
        select(func.count()).select_from(ConversionModel).where(ConversionModel.user_id == user_id)
    )
    total_convs = conv_count_result.scalar() or 0

    completed_result = await db.execute(
        select(func.count())
        .select_from(ConversionModel)
        .where(ConversionModel.user_id == user_id, ConversionModel.status == "completed")
    )
    completed = completed_result.scalar() or 0

    failed_result = await db.execute(
        select(func.count())
        .select_from(ConversionModel)
        .where(ConversionModel.user_id == user_id, ConversionModel.status == "failed")
    )
    failed = failed_result.scalar() or 0

    time_result = await db.execute(
        select(func.coalesce(func.sum(ConversionModel.processing_time_ms), 0))
        .where(ConversionModel.user_id == user_id)
    )
    total_time = time_result.scalar() or 0

    return {
        "total_documents": total_docs,
        "total_conversions": total_convs,
        "completed_conversions": completed,
        "failed_conversions": failed,
        "total_processing_time_ms": total_time,
    }


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    import uuid as uuid_mod
    doc_uuid = uuid_mod.UUID(document_id)
    result = await db.execute(
        select(DocumentModel).where(DocumentModel.id == doc_uuid, DocumentModel.user_id == user_id)
    )
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return doc


@router.delete("/{document_id}", status_code=204)
async def delete_document(
    document_id: str,
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    import uuid as uuid_mod
    from core.storage import delete_file_from_s3

    doc_uuid = uuid_mod.UUID(document_id)
    result = await db.execute(
        select(DocumentModel).where(DocumentModel.id == doc_uuid, DocumentModel.user_id == user_id)
    )
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        delete_file_from_s3(doc.s3_key)
    except Exception:
        pass

    await db.delete(doc)
    await db.commit()
