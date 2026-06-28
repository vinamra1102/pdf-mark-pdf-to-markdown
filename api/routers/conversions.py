from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from math import ceil

from core.database import get_db, DocumentModel, ConversionModel, ConversionStatusEnum
from core.auth import verify_clerk_token
from core.storage import generate_presigned_download_url
from workers.convert import convert_pdf
from schemas.conversion import ConversionResponse, ConversionDetailResponse, PaginatedConversionsResponse

router = APIRouter(prefix="/conversions", tags=["conversions"])


@router.post("/{document_id}", response_model=ConversionResponse, status_code=201)
async def start_conversion(
    document_id: str,
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    import uuid as uuid_mod
    doc_uuid = uuid_mod.UUID(document_id)

    doc_result = await db.execute(
        select(DocumentModel).where(DocumentModel.id == doc_uuid, DocumentModel.user_id == user_id)
    )
    doc = doc_result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    conv = ConversionModel(
        document_id=doc_uuid,
        user_id=user_id,
        status=ConversionStatusEnum.PENDING,
    )
    db.add(conv)
    await db.commit()
    await db.refresh(conv)

    convert_pdf.delay(
        conversion_id=str(conv.id),
        document_id=str(doc.id),
        user_id=user_id,
        s3_key=doc.s3_key,
    )

    return conv


@router.get("/", response_model=PaginatedConversionsResponse)
async def list_conversions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    query = select(func.count()).select_from(ConversionModel).where(ConversionModel.user_id == user_id)
    if status:
        query = query.where(ConversionModel.status == status)
    count_result = await db.execute(query)
    total = count_result.scalar() or 0

    conv_query = select(ConversionModel).where(ConversionModel.user_id == user_id)
    if status:
        conv_query = conv_query.where(ConversionModel.status == status)
    conv_query = (
        conv_query
        .options(joinedload(ConversionModel.document))
        .order_by(ConversionModel.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(conv_query)
    conversions = result.unique().scalars().all()

    return PaginatedConversionsResponse(
        items=[ConversionResponse.model_validate(c) for c in conversions],
        total=total,
        page=page,
        page_size=page_size,
        pages=ceil(total / page_size) if total > 0 else 0,
    )


@router.get("/{conversion_id}", response_model=ConversionDetailResponse)
async def get_conversion(
    conversion_id: str,
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    import uuid as uuid_mod
    conv_uuid = uuid_mod.UUID(conversion_id)

    result = await db.execute(
        select(ConversionModel)
        .options(joinedload(ConversionModel.document))
        .where(ConversionModel.id == conv_uuid, ConversionModel.user_id == user_id)
    )
    conv = result.unique().scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversion not found")

    return conv


@router.get("/{conversion_id}/download", response_class=PlainTextResponse)
async def download_conversion(
    conversion_id: str,
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    import uuid as uuid_mod
    conv_uuid = uuid_mod.UUID(conversion_id)

    result = await db.execute(
        select(ConversionModel).where(
            ConversionModel.id == conv_uuid,
            ConversionModel.user_id == user_id,
            ConversionModel.status == ConversionStatusEnum.COMPLETED,
        )
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversion not found or not completed")

    return PlainTextResponse(
        content=conv.markdown_content or "",
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename=conversion-{conversion_id}.md"},
    )


@router.get("/{conversion_id}/download-url")
async def get_download_url(
    conversion_id: str,
    user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
):
    import uuid as uuid_mod
    conv_uuid = uuid_mod.UUID(conversion_id)

    result = await db.execute(
        select(ConversionModel).where(
            ConversionModel.id == conv_uuid,
            ConversionModel.user_id == user_id,
            ConversionModel.status == ConversionStatusEnum.COMPLETED,
        )
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversion not found or not completed")

    if not conv.s3_result_key:
        raise HTTPException(status_code=404, detail="Result file not available")

    url = generate_presigned_download_url(conv.s3_result_key)
    return {"download_url": url}
