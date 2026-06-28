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
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <div className="flex items-center border-b border-border/50 bg-card/50 px-4">
        <button
          onClick={() => setView("preview")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm transition-colors border-b-2 -mb-px",
            view === "preview" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          )}
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
        <button
          onClick={() => setView("raw")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm transition-colors border-b-2 -mb-px",
            view === "raw" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          )}
        >
          <Code2 className="h-4 w-4" /> Raw
        </button>
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto">
        {view === "preview" ? (
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-table:border prose-table:border-border/50 prose-th:border prose-th:border-border/50 prose-th:bg-muted/50 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-border/50 prose-td:px-3 prose-td:py-2">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap break-words">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}
