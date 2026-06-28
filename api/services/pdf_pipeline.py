import re
import io
import time
from typing import Optional
from dataclasses import dataclass, field

import pdfplumber
import fitz
from pdfplumber.page import Page as PlumberPage
from collections import defaultdict


@dataclass
class PDFTextBlock:
    text: str
    x0: float
    y0: float
    x1: float
    y1: float
    font_size: float = 0
    font_name: str = ""
    page_num: int = 0


@dataclass
class PDFPageResult:
    page_num: int
    text: str = ""
    blocks: list[PDFTextBlock] = field(default_factory=list)
    images: list[bytes] = field(default_factory=list)
    tables: list[list[list[str]]] = field(default_factory=list)


@dataclass
class PDFPipelineResult:
    markdown: str
    pdf_type: str
    page_count: int
    has_tables: bool = False
    has_images: bool = False


class PDFPipeline:
    HEADER_FOOTER_MARGIN_TOP: float = 60.0
    HEADER_FOOTER_MARGIN_BOTTOM: float = 60.0
    MIN_HEADING_FONT_SIZE: float = 13.0
    COLUMN_GAP_THRESHOLD: float = 30.0
    REPEATED_TEXT_THRESHOLD: int = 2

    def process(self, pdf_bytes: bytes, perform_ocr: bool = True) -> PDFPipelineResult:
        start_time = time.time()

        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        page_count = doc.page_count

        pdf_type = self._detect_pdf_type(pdf_bytes, page_count)

        pages: list[PDFPageResult] = []
        all_images: list[bytes] = []

        with pdfplumber.open(io.BytesIO(pdf_bytes)) as plumber_doc:
            for page_num, plumber_page in enumerate(plumber_doc.pages):
                page_result = self._process_page(plumber_page, doc[page_num], page_num, pdf_type, perform_ocr)
                pages.append(page_result)
                all_images.extend(page_result.images)

        detected_headers_footers = self._detect_repeated_text(pages)
        markdown = self._assemble_markdown(pages, detected_headers_footers, all_images)

        doc.close()

        return PDFPipelineResult(
            markdown=markdown,
            pdf_type=pdf_type,
            page_count=page_count,
            has_tables=any(len(p.tables) > 0 for p in pages),
            has_images=len(all_images) > 0,
        )

    def _detect_pdf_type(self, pdf_bytes: bytes, page_count: int) -> str:
        text_chars = 0
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages_to_check = min(page_count, 5)

        for i in range(pages_to_check):
            page = doc[i]
            text = page.get_text()
            text_chars += len(text.strip())

        doc.close()

        avg_chars = text_chars / pages_to_check
        if avg_chars < 50:
            return "scanned"
        elif avg_chars < 200:
            return "mixed"
        return "text"

    def _process_page(
        self,
        plumber_page: PlumberPage,
        fitz_page: fitz.Page,
        page_num: int,
        pdf_type: str,
        perform_ocr: bool,
    ) -> PDFPageResult:
        result = PDFPageResult(page_num=page_num + 1)

        extracted_text = plumber_page.extract_text() or ""
        char_count = len(extracted_text.strip())

        if char_count < 30 and perform_ocr:
            ocr_text = self._ocr_page(fitz_page)
            if ocr_text:
                result.text = ocr_text
            else:
                result.text = extracted_text
        else:
            result.text = extracted_text

        result.blocks = self._extract_blocks(plumber_page, fitz_page)
        result.tables = self._extract_tables(plumber_page)
        result.images = self._extract_images(fitz_page)

        return result

    def _ocr_page(self, fitz_page: fitz.Page) -> str:
        try:
            import pytesseract
            from PIL import Image

            pix = fitz_page.get_pixmap(dpi=300)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            text = pytesseract.image_to_string(img)
            return text
        except Exception:
            return ""

    def _extract_blocks(self, plumber_page: PlumberPage, fitz_page: fitz.Page) -> list[PDFTextBlock]:
        blocks: list[PDFTextBlock] = []
        fitz_blocks = fitz_page.get_text("dict").get("blocks", [])

        for block in fitz_blocks:
            if block.get("type") != 0:
                continue

            bbox = block.get("bbox", [0, 0, 0, 0])
            block_text_parts = []

            for line in block.get("lines", []):
                line_text_parts = []
                max_font_size = 0
                font_name = ""

                for span in line.get("spans", []):
                    line_text_parts.append(span.get("text", ""))
                    span_size = span.get("size", 0)
                    if span_size > max_font_size:
                        max_font_size = span_size
                        font_name = span.get("font", "")

                line_text = "".join(line_text_parts)
                if line_text.strip():
                    block_text_parts.append(line_text.strip())

            full_text = " ".join(block_text_parts)
            if full_text.strip():
                blocks.append(PDFTextBlock(
                    text=full_text.strip(),
                    x0=bbox[0],
                    y0=bbox[1],
                    x1=bbox[2],
                    y1=bbox[3],
                    font_size=max_font_size,
                    font_name=font_name,
                    page_num=plumber_page.page_number,
                ))

        return sorted(blocks, key=lambda b: (b.y0, b.x0))

    def _extract_tables(self, plumber_page: PlumberPage) -> list[list[list[str]]]:
        tables: list[list[list[str]]] = []
        try:
            raw_tables = plumber_page.extract_tables()
        except Exception:
            raw_tables = []

        for table in raw_tables:
            if not table:
                continue
            cleaned: list[list[str]] = []
            for row in table:
                cleaned_row = [cell.strip() if cell else "" for cell in row]
                if any(cell for cell in cleaned_row):
                    cleaned.append(cleaned_row)
            if cleaned:
                tables.append(cleaned)

        return tables

    def _extract_images(self, fitz_page: fitz.Page) -> list[bytes]:
        images: list[bytes] = []
        image_list = fitz_page.get_images(full=True)

        for img_info in image_list:
            try:
                xref = img_info[0]
                base_image = fitz_page.parent.extract_image(xref)
                if base_image and base_image.get("image"):
                    images.append(base_image["image"])
            except Exception:
                continue

        return images

    def _detect_repeated_text(self, pages: list[PDFPageResult]) -> set[str]:
        if len(pages) < 3:
            return set()

        first_line_freq: dict[str, int] = defaultdict(int)
        last_line_freq: dict[str, int] = defaultdict(int)

        for page in pages:
            lines = page.text.strip().split("\n")
            if lines:
                first_line = lines[0].strip()
                if len(first_line) > 3:
                    first_line_freq[first_line] += 1
                last_line = lines[-1].strip()
                if len(last_line) > 3:
                    last_line_freq[last_line] += 1

        repeated = set()
        for text, count in first_line_freq.items():
            if count >= self.REPEATED_TEXT_THRESHOLD:
                repeated.add(text)
        for text, count in last_line_freq.items():
            if count >= self.REPEATED_TEXT_THRESHOLD:
                repeated.add(text)

        return repeated

    def _is_heading(self, block: PDFTextBlock) -> bool:
        text = block.text
        if len(text) > 120:
            return False
        if block.font_size >= self.MIN_HEADING_FONT_SIZE:
            return True
        if block.font_name and "Bold" in block.font_name and len(text) < 100:
            return True
        heading_patterns = [
            r"^(?:Chapter|Section|Part)\s+\d+",
            r"^\d+\.\s+[A-Z]",
            r"^[A-Z][A-Z\s]{4,}$",
            r"^(?:Abstract|Introduction|Conclusion|References|Appendix|Summary)",
        ]
        for pattern in heading_patterns:
            if re.match(pattern, text):
                return True
        return False

    def _detect_heading_level(self, block: PDFTextBlock, all_blocks: list[PDFTextBlock]) -> int:
        font_sizes = sorted({b.font_size for b in all_blocks if b.font_size > 0}, reverse=True)

        for level, size in enumerate(font_sizes[:6], start=1):
            if abs(block.font_size - size) < 0.5:
                return min(level, 6)

        if block.font_size >= 18:
            return 1
        elif block.font_size >= 15:
            return 2
        elif block.font_size >= 13:
            return 3
        return 4

    def _detect_columns(self, blocks: list[PDFTextBlock]) -> list[list[PDFTextBlock]]:
        if not blocks:
            return []

        page_x0 = min(b.x0 for b in blocks)
        page_x1 = max(b.x1 for b in blocks)
        page_width = page_x1 - page_x0

        if page_width < self.COLUMN_GAP_THRESHOLD * 3:
            return [sorted(blocks, key=lambda b: b.y0)]

        x_positions = sorted(set(b.x0 for b in blocks))
        clusters: list[list[float]] = []
        current_cluster = [x_positions[0]]

        for i in range(1, len(x_positions)):
            if x_positions[i] - current_cluster[-1] > self.COLUMN_GAP_THRESHOLD:
                clusters.append(current_cluster)
                current_cluster = [x_positions[i]]
            else:
                current_cluster.append(x_positions[i])
        clusters.append(current_cluster)

        if len(clusters) == 1:
            return [sorted(blocks, key=lambda b: b.y0)]

        column_blocks: list[list[PDFTextBlock]] = [[] for _ in clusters]
        cluster_centers = [sum(c) / len(c) for c in clusters]

        for block in blocks:
            block_center = (block.x0 + block.x1) / 2
            best_col = min(range(len(cluster_centers)), key=lambda i: abs(block_center - cluster_centers[i]))
            column_blocks[best_col].append(block)

        for col in column_blocks:
            col.sort(key=lambda b: b.y0)

        return column_blocks

    def _table_to_markdown(self, table: list[list[str]]) -> str:
        if not table:
            return ""

        max_cols = max(len(row) for row in table)
        normalized = [row + [""] * (max_cols - len(row)) for row in table]

        lines: list[str] = []
        header = normalized[0]
        lines.append("| " + " | ".join(header) + " |")
        lines.append("| " + " | ".join(["---"] * max_cols) + " |")

        for row in normalized[1:]:
            lines.append("| " + " | ".join(row) + " |")

        return "\n".join(lines) + "\n"

    def _assemble_markdown(
        self,
        pages: list[PDFPageResult],
        repeated_text: set[str],
        all_images: list[bytes],
    ) -> str:
        markdown_parts: list[str] = []

        for page_idx, page in enumerate(pages):
            if page_idx > 0:
                markdown_parts.append("\n")

            if page.tables:
                for table in page.tables:
                    markdown_parts.append(self._table_to_markdown(table))

            if page.images:
                for img_idx in range(len(page.images)):
                    markdown_parts.append(f"![Image from page {page.page_num}, figure {img_idx + 1}](page-{page.page_num}-fig-{img_idx + 1}.png)\n")

            if page.blocks:
                columns = self._detect_columns(page.blocks)

                if len(columns) > 1:
                    for col_blocks in columns:
                        for block in col_blocks:
                            clean = block.text.strip()
                            if not clean or clean in repeated_text:
                                continue
                            markdown_parts.append(clean + "\n")
                    continue

                for block in columns[0]:
                    clean = block.text.strip()
                    if not clean or clean in repeated_text:
                        continue

                    if self._is_heading(block):
                        level = self._detect_heading_level(block, page.blocks)
                        prefix = "#" * level
                        markdown_parts.append(f"{prefix} {clean}\n")
                    else:
                        markdown_parts.append(clean + "\n")

            elif page.text.strip() and not page.blocks:
                lines = page.text.strip().split("\n")
                for line in lines:
                    clean_line = line.strip()
                    if clean_line and clean_line not in repeated_text:
                        markdown_parts.append(clean_line + "\n")

        result = "\n".join(markdown_parts)
        result = re.sub(r"\n{3,}", "\n\n", result)
        result = result.strip()

        return result
