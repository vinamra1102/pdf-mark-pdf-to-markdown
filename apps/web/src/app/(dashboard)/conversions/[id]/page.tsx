"use client";

import { useParams } from "next/navigation";
import { Download, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useConversion } from "@/hooks/useConversions";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { ConversionStatus } from "@/types";

const statusClasses: Record<string, string> = {
  [ConversionStatus.PENDING]: "bg-brand-light-gray text-brand-dark-gray",
  [ConversionStatus.PROCESSING]: "bg-brand-orange/10 text-brand-orange border border-brand-orange/25",
  [ConversionStatus.COMPLETED]: "bg-green-50 text-green-700 border border-green-200",
  [ConversionStatus.FAILED]: "bg-red-50 text-red-600 border border-red-200",
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
        <div className="h-8 w-48 bg-brand-light-gray/50 rounded animate-pulse" />
        <div className="h-4 w-72 bg-brand-light-gray/50 rounded animate-pulse" />
        <div className="h-[500px] w-full bg-brand-light-gray/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !conversion) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold text-brand-black mb-2">Conversion not found</h2>
        <p className="text-brand-dark-gray mb-4">The conversion you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/history" className="btn-ghost inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Link href="/history" className="text-sm text-brand-dark-gray hover:text-brand-black inline-flex items-center gap-1 mb-4 transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to History
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-black mb-1">Conversion {id.slice(0, 12)}...</h1>
            <div className="flex items-center gap-3 text-sm text-brand-dark-gray">
              <span>{new Date(conversion.created_at).toLocaleString()}</span>
              {conversion.page_count && <span>· {conversion.page_count} pages</span>}
              {conversion.pdf_type && <span>· {conversion.pdf_type} PDF</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[conversion.status] || "bg-brand-light-gray text-brand-dark-gray"}`}>
              {conversion.status}
            </span>
            {conversion.status === ConversionStatus.COMPLETED && (
              <>
                <button onClick={handleCopy} className="btn-ghost inline-flex items-center gap-1.5 !px-4 !py-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button onClick={handleDownload} className="btn-primary inline-flex items-center gap-1.5">
                  <Download className="h-4 w-4" /> Download
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {conversion.status === ConversionStatus.PROCESSING && (
        <div className="flex items-center justify-center py-12 gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-orange" />
          <span className="text-brand-dark-gray">Processing your PDF... This may take a moment.</span>
        </div>
      )}

      {conversion.status === ConversionStatus.FAILED && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-600 mb-2">Conversion Failed</h3>
          <p className="text-sm text-brand-dark-gray">{conversion.error_message || "An unknown error occurred."}</p>
        </div>
      )}

      {conversion.status === ConversionStatus.COMPLETED && conversion.markdown_content && (
        <MarkdownPreview content={conversion.markdown_content} />
      )}
    </div>
  );
}
