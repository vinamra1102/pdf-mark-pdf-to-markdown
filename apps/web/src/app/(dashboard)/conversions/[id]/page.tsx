"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useConversion } from "@/hooks/useConversions";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ConversionStatus } from "@/types";

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "destructive"> = {
  [ConversionStatus.PENDING]: "warning",
  [ConversionStatus.PROCESSING]: "default",
  [ConversionStatus.COMPLETED]: "success",
  [ConversionStatus.FAILED]: "destructive",
};

export default function ConversionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: conversion, isLoading, error } = useConversion(id);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (!conversion?.markdown_content) return;
    const blob = new Blob([conversion.markdown_content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversion-${id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!conversion?.markdown_content) return;
    navigator.clipboard.writeText(conversion.markdown_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (error || !conversion) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Conversion not found</h2>
        <p className="text-muted-foreground mb-4">The conversion you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/history">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to History
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to History
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Conversion {id.slice(0, 12)}...</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{new Date(conversion.created_at).toLocaleString()}</span>
              {conversion.page_count && <span>· {conversion.page_count} pages</span>}
              {conversion.pdf_type && <span>· {conversion.pdf_type} PDF</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={statusBadgeVariant[conversion.status] || "default"} className="text-sm px-3 py-1">
              {conversion.status}
            </Badge>
            {conversion.status === ConversionStatus.COMPLETED && (
              <>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {conversion.status === ConversionStatus.PROCESSING && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12 gap-3"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <span className="text-muted-foreground">Processing your PDF... This may take a moment.</span>
        </motion.div>
      )}

      {conversion.status === ConversionStatus.FAILED && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-6"
        >
          <h3 className="font-semibold text-red-400 mb-2">Conversion Failed</h3>
          <p className="text-sm text-muted-foreground">{conversion.error_message || "An unknown error occurred."}</p>
        </motion.div>
      )}

      {conversion.status === ConversionStatus.COMPLETED && conversion.markdown_content && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <MarkdownPreview content={conversion.markdown_content} />
        </motion.div>
      )}
    </div>
  );
}
