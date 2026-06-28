"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Eye, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [view, setView] = useState<"preview" | "raw">("preview");

  return (
    <div className="border border-brand-light-gray rounded-xl overflow-hidden">
      <div className="flex items-center border-b border-brand-light-gray bg-white px-4">
        <button
          onClick={() => setView("preview")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm transition-colors border-b-2 -mb-px",
            view === "preview"
              ? "border-brand-orange text-brand-orange font-medium"
              : "border-transparent text-brand-dark-gray hover:text-brand-black"
          )}
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
        <button
          onClick={() => setView("raw")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm transition-colors border-b-2 -mb-px",
            view === "raw"
              ? "border-brand-orange text-brand-orange font-medium"
              : "border-transparent text-brand-dark-gray hover:text-brand-black"
          )}
        >
          <Code2 className="h-4 w-4" /> Raw
        </button>
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto bg-white">
        {view === "preview" ? (
          <div className="prose prose-sm max-w-none prose-headings:text-brand-black prose-p:text-brand-dark-gray prose-a:text-brand-orange prose-strong:text-brand-black prose-code:text-brand-black prose-code:bg-brand-light-gray/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#0D0D0D] prose-pre:text-white/80 prose-pre:border prose-pre:border-brand-light-gray prose-table:border prose-table:border-brand-light-gray prose-th:border prose-th:border-brand-light-gray prose-th:bg-brand-light-gray/30 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-brand-light-gray prose-td:px-3 prose-td:py-2">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="font-mono text-sm text-brand-black whitespace-pre-wrap break-words">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}
