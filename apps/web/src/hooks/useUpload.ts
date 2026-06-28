import { useState, useCallback } from "react";
import { api } from "@/lib/api";

interface UploadState {
  status: "idle" | "uploading" | "processing" | "done" | "error";
  progress: number;
  documentId: string | null;
  error: string | null;
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    documentId: null,
    error: null,
  });

  const upload = useCallback(async (file: File) => {
    setState({ status: "uploading", progress: 0, documentId: null, error: null });

    try {
      const { upload_url, document_id } = await api.documents.createUploadUrl();

      setState((s) => ({ ...s, progress: 10, documentId: document_id }));

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", upload_url);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = 10 + Math.round((e.loaded / e.total) * 80);
            setState((s) => ({ ...s, progress: pct }));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(undefined);
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(file);
      });

      setState((s) => ({ ...s, progress: 90 }));

      const doc = await api.documents.confirmUpload(document_id, file.name, file.size);

      setState({ status: "done", progress: 100, documentId: doc.id, error: null });
      return doc;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setState({ status: "error", progress: 0, documentId: null, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", progress: 0, documentId: null, error: null });
  }, []);

  return { upload, reset, ...state };
}
