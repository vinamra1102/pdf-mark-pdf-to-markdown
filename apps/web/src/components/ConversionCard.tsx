"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { ConversionStatus } from "@/types";
import type { Conversion } from "@/types";

const statusClasses: Record<string, string> = {
  [ConversionStatus.PENDING]: "bg-brand-light-gray text-brand-dark-gray",
  [ConversionStatus.PROCESSING]: "bg-brand-orange/10 text-brand-orange border border-brand-orange/25",
  [ConversionStatus.COMPLETED]: "bg-green-50 text-green-700 border border-green-200",
  [ConversionStatus.FAILED]: "bg-red-50 text-red-600 border border-red-200",
};

interface ConversionCardProps {
  conversion: Conversion;
}

export function ConversionCard({ conversion }: ConversionCardProps) {
  return (
    <Link href={`/conversions/${conversion.id}`}>
      <div className="bg-white border border-brand-light-gray rounded-xl p-7 hover:border-brand-orange/30 transition-colors cursor-pointer group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-brand-dark-gray" />
            <div>
              <p className="font-mono text-sm text-brand-black font-medium">{conversion.id.slice(0, 10)}...</p>
              <p className="text-xs text-brand-dark-gray">
                {new Date(conversion.created_at).toLocaleDateString()} · {new Date(conversion.created_at).toLocaleTimeString()}
              </p>
              {conversion.pdf_type && (
                <p className="text-xs text-brand-dark-gray mt-0.5">
                  {conversion.pdf_type} · {conversion.page_count ?? "?"} pages
                  {conversion.processing_time_ms && ` · ${(conversion.processing_time_ms / 1000).toFixed(1)}s`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses[conversion.status] || "bg-brand-light-gray text-brand-dark-gray"}`}>
              {conversion.status}
            </span>
            <ArrowUpRight className="h-4 w-4 text-brand-dark-gray opacity-0 group-hover:opacity-100 group-hover:text-brand-orange transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
