export const ConversionStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type ConversionStatus =
  (typeof ConversionStatus)[keyof typeof ConversionStatus];

export const PDFType = {
  TEXT: "text",
  SCANNED: "scanned",
  MIXED: "mixed",
} as const;

export type PDFType = (typeof PDFType)[keyof typeof PDFType];

export interface Document {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  sizeBytes: number;
  mimeType: string;
  s3Key: string;
  pdfType: PDFType | null;
  pageCount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Conversion {
  id: string;
  documentId: string;
  userId: string;
  status: ConversionStatus;
  pdfType: PDFType | null;
  markdownContent: string | null;
  pageCount: number | null;
  processingTimeMs: number | null;
  errorMessage: string | null;
  s3ResultKey: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  document?: Document;
}

export interface ConversionDetail extends Conversion {
  document: Document;
}

export interface ApiError {
  status: number;
  message: string;
  detail: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  documentId: string;
  fields: Record<string, string>;
}

export interface ConversionStats {
  totalDocuments: number;
  totalConversions: number;
  completedConversions: number;
  failedConversions: number;
  totalProcessingTimeMs: number;
}
