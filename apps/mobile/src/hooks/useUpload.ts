import { useState, useCallback } from "react";
import * as FileSystem from "expo-file-system";
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

  const upload = useCallback(async (uri: string, filename: string, mimeType: string) => {
    setState({ status: "uploading", progress: 0, documentId: null, error: null });

    try {
      const { upload_url, document_id } = await api.documents.createUploadUrl();
      setState((s) => ({ ...s, progress: 10, documentId: document_id }));

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("File not found");
      }

      const uploadTask = FileSystem.createUploadTask(
        upload_url,
        uri,
        {
          httpMethod: "PUT",
          headers: { "Content-Type": mimeType },
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        },
        (progressEvent) => {
          const pct = 10 + Math.round(
            ((progressEvent.totalBytesSent || 0) / (progressEvent.totalBytesExpectedToSend || 1)) * 80
          );
          setState((s) => ({ ...s, progress: pct }));
        }
      );

      await uploadTask.uploadAsync();

      setState((s) => ({ ...s, progress: 90 }));

      const doc = await api.documents.confirmUpload(
        document_id,
        filename,
        fileInfo.size || 0
      );

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
