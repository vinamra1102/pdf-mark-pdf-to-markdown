import time
from datetime import datetime, timezone

from core.celery_app import celery_app
from core.database import async_session_factory, ConversionModel, DocumentModel, ConversionStatusEnum, PDFTypeEnum
from core.storage import download_file_from_s3, upload_file_to_s3, generate_result_s3_key
from services.pdf_pipeline import PDFPipeline


@celery_app.task(bind=True, name="workers.convert.convert_pdf", max_retries=3, default_retry_delay=30)
def convert_pdf(self, conversion_id: str, document_id: str, user_id: str, s3_key: str):
    import asyncio
    return asyncio.get_event_loop().run_until_complete(
        _convert_pdf_async(conversion_id, document_id, user_id, s3_key)
    )


async def _convert_pdf_async(conversion_id: str, document_id: str, user_id: str, s3_key: str):
    async with async_session_factory() as session:
        try:
            conv = await session.get(ConversionModel, conversion_id)
            if not conv:
                return

            conv.status = ConversionStatusEnum.PROCESSING
            await session.commit()

            pdf_bytes = download_file_from_s3(s3_key)

            pipeline = PDFPipeline()
            start = time.time()
            result = pipeline.process(pdf_bytes, perform_ocr=True)
            elapsed_ms = int((time.time() - start) * 1000)

            result_s3_key = generate_result_s3_key(user_id, document_id)
            upload_file_to_s3(
                result.markdown.encode("utf-8"),
                result_s3_key,
                "text/markdown",
            )

            conv.status = ConversionStatusEnum.COMPLETED
            conv.pdf_type = PDFTypeEnum(result.pdf_type)
            conv.markdown_content = result.markdown
            conv.page_count = result.page_count
            conv.processing_time_ms = elapsed_ms
            conv.s3_result_key = result_s3_key
            conv.completed_at = datetime.now(timezone.utc)

            doc = await session.get(DocumentModel, document_id)
            if doc:
                doc.pdf_type = PDFTypeEnum(result.pdf_type)
                doc.page_count = result.page_count

            await session.commit()

        except Exception as e:
            await session.rollback()

            async with async_session_factory() as retry_session:
                conv = await retry_session.get(ConversionModel, conversion_id)
                if conv:
                    conv.status = ConversionStatusEnum.FAILED
                    conv.error_message = str(e)
                    await retry_session.commit()

            raise
