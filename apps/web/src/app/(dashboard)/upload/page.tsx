"use client";

import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/components/UploadDropzone";

export default function UploadPage() {
  const router = useRouter();

  const handleUploadComplete = (documentId: string) => {
    router.push(`/conversions/${documentId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <UploadCloud className="h-7 w-7 text-brand-orange" />
          <h1 className="text-3xl font-bold text-brand-black">Upload PDF</h1>
        </div>
        <p className="text-brand-dark-gray">Drop your PDF here. We handle text, scanned, and mixed content.</p>
      </div>

      <UploadDropzone onUploadComplete={handleUploadComplete} />

      <div className="text-center">
        <p className="text-xs text-brand-dark-gray">
          Supported: PDF up to 100MB. Text, scanned, and mixed content supported.
        </p>
      </div>
    </div>
  );
}
