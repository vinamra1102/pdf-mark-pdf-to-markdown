"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/Button";

export default function UploadPage() {
  const router = useRouter();

  const handleUploadComplete = (documentId: string) => {
    router.push(`/conversions/${documentId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <UploadCloud className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Upload PDF</h1>
        </div>
        <p className="text-muted-foreground">Drop your PDF here. We handle text, scanned, and mixed content.</p>
      </motion.div>

      <UploadDropzone onUploadComplete={handleUploadComplete} />

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Supported: PDF up to 100MB. Text, scanned, and mixed content supported.
        </p>
      </div>
    </div>
  );
}
