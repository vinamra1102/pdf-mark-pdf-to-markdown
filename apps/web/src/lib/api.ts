const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1";

async function getAuthHeaders(): Promise<Record<string, string>> {
  return {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders();
  const url = `${API_URL}${API_PREFIX}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || body.message || `Request failed with status ${res.status}`);
  }

  if (res.headers.get("content-type")?.includes("text/markdown")) {
    return (await res.text()) as unknown as T;
  }

  return res.json();
}

export const api = {
  documents: {
    createUploadUrl: () =>
      request<{ upload_url: string; document_id: string; fields: Record<string, string> }>(
        "/documents/upload-url",
        { method: "POST" }
      ),

    confirmUpload: (documentId: string, filename: string, sizeBytes: number) =>
      request<import("@pdfmark/shared").Document>(
        `/documents/upload/confirm?document_id=${documentId}&filename=${encodeURIComponent(filename)}&size_bytes=${sizeBytes}`,
        { method: "POST" }
      ),

    list: (page = 1, pageSize = 20) =>
      request<import("@pdfmark/shared").PaginatedResponse<import("@pdfmark/shared").Document>>(
        `/documents/?page=${page}&page_size=${pageSize}`
      ),

    get: (id: string) => request<import("@pdfmark/shared").Document>(`/documents/${id}`),

    getStats: () =>
      request<import("@pdfmark/shared").ConversionStats>("/documents/stats"),

    delete: (id: string) =>
      request<void>(`/documents/${id}`, { method: "DELETE" }),
  },

  conversions: {
    start: (documentId: string) =>
      request<import("@pdfmark/shared").Conversion>(
        `/conversions/${documentId}`,
        { method: "POST" }
      ),

    list: (page = 1, pageSize = 20, status?: string) => {
      let path = `/conversions/?page=${page}&page_size=${pageSize}`;
      if (status) path += `&status=${status}`;
      return request<import("@pdfmark/shared").PaginatedResponse<import("@pdfmark/shared").Conversion>>(path);
    },

    get: (id: string) =>
      request<import("@pdfmark/shared").ConversionDetail>(`/conversions/${id}`),

    download: (id: string) =>
      request<string>(`/conversions/${id}/download`),

    downloadUrl: (id: string) =>
      request<{ download_url: string }>(`/conversions/${id}/download-url`),
  },

  health: {
    check: () => request<{ status: string }>("/health"),
  },
};
