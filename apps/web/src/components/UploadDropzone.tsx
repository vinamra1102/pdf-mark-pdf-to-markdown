"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
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
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                ${isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50 hover:bg-accent/30"}`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
              <Button variant="outline" size="sm">Select PDF</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border/50 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              {upload.status === "done" ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : upload.status === "error" ? (
                <AlertCircle className="h-6 w-6 text-red-400" />
              ) : null}
            </div>

            {upload.status === "idle" && (
              <div className="flex gap-3">
                <Button onClick={handleUpload} className="flex-1" disabled={startConversion.isPending}>
                  {startConversion.isPending ? "Converting..." : "Upload & Convert"}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Cancel
                </Button>
              </div>
            )}

            {upload.status === "uploading" && (
              <div className="space-y-2">
                <Progress value={upload.progress} />
                <p className="text-sm text-muted-foreground text-center">{upload.progress}% uploaded</p>
              </div>
            )}

            {(upload.status === "done" || upload.status === "error") && (
              <Button variant="outline" className="w-full" onClick={handleReset}>
                Upload another file
              </Button>
            )}

            {upload.error && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                {upload.error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
