"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import { useStartConversion } from "@/hooks/useConversions";

interface UploadDropzoneProps {
  onUploadComplete?: (documentId: string) => void;
}

export function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const upload = useUpload();
  const startConversion = useStartConversion();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
    disabled: upload.status === "uploading",
  });

  const handleUpload = async () => {
    if (!file) return;
    try {
      const doc = await upload.upload(file);
      const conv = await startConversion.mutateAsync(doc.id);
      if (onUploadComplete) {
        onUploadComplete(conv.id);
      }
    } catch {
      // error handled by useUpload state
    }
  };

  const handleReset = () => {
    setFile(null);
    upload.reset();
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl bg-white p-16 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? "border-brand-orange bg-brand-orange/[0.08]"
              : "border-brand-light-gray hover:border-brand-orange hover:bg-brand-orange/5"
            }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`h-12 w-12 mx-auto mb-4 transition-colors ${isDragActive ? "text-brand-orange" : "text-brand-dark-gray"}`} />
          <h3 className="text-lg font-semibold text-brand-black mb-2">
            {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
          </h3>
          <p className="text-sm text-brand-dark-gray mb-4">or click to browse files</p>
          <span className="btn-ghost inline-block">Select PDF</span>
        </div>
      ) : (
        <div className="border border-brand-light-gray rounded-xl p-6 space-y-4 bg-white">
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10 text-brand-orange" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-brand-black truncate">{file.name}</p>
              <p className="text-sm text-brand-dark-gray">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            {upload.status === "done" ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : upload.status === "error" ? (
              <AlertCircle className="h-6 w-6 text-red-600" />
            ) : null}
          </div>

          {upload.status === "idle" && (
            <div className="flex gap-3">
              <button onClick={handleUpload} className="btn-primary flex-1 w-full py-3" disabled={startConversion.isPending}>
                {startConversion.isPending ? "Converting..." : "Upload & Convert"}
              </button>
              <button onClick={handleReset} className="btn-ghost">
                Cancel
              </button>
            </div>
          )}

          {upload.status === "uploading" && (
            <div className="space-y-2">
              <div className="bg-brand-light-gray h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-orange h-full rounded-full transition-all"
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
              <p className="text-sm text-brand-dark-gray text-center">{upload.progress}% uploaded</p>
            </div>
          )}

          {(upload.status === "done" || upload.status === "error") && (
            <button onClick={handleReset} className="btn-ghost w-full">
              Upload another file
            </button>
          )}

          {upload.error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {upload.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
