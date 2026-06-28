"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FileText, CheckCircle2, XCircle, Clock, Zap, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { useConversions } from "@/hooks/useConversions";
import { ConversionStatus } from "@/types";
import type { Conversion } from "@/types";

const statusClasses: Record<string, string> = {
  [ConversionStatus.PENDING]: "bg-brand-light-gray text-brand-dark-gray",
  [ConversionStatus.PROCESSING]: "bg-brand-orange/10 text-brand-orange border border-brand-orange/25",
  [ConversionStatus.COMPLETED]: "bg-green-50 text-green-700 border border-green-200",
  [ConversionStatus.FAILED]: "bg-red-50 text-red-600 border border-red-200",
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.documents.getStats(),
  });

  const { data: conversions, isLoading: convsLoading } = useConversions(1, 5);

  const statCards = [
    { label: "Total Documents", value: stats?.total_documents ?? 0, icon: FileText },
    { label: "Conversions", value: stats?.total_conversions ?? 0, icon: Zap },
    { label: "Completed", value: stats?.completed_conversions ?? 0, icon: CheckCircle2 },
    { label: "Failed", value: stats?.failed_conversions ?? 0, icon: XCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-black mb-2">Dashboard</h1>
        <p className="text-brand-dark-gray">Overview of your PDF conversions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-brand-light-gray rounded-xl p-6">
            {statsLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-20 bg-brand-light-gray/50 rounded animate-pulse" />
                <div className="h-8 w-12 bg-brand-light-gray/50 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-brand-dark-gray text-sm">{card.label}</span>
                  <div className="bg-brand-orange/10 p-2.5 rounded-lg">
                    <card.icon className="h-5 w-5 text-brand-orange" />
                  </div>
                </div>
                <div className="text-brand-black font-bold text-2xl">{card.value}</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-brand-black">Recent Conversions</h2>
          <Link href="/history" className="text-sm text-brand-orange hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {convsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-brand-light-gray/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !conversions?.items?.length ? (
          <div className="bg-white border border-brand-light-gray rounded-xl p-8 text-center">
            <FileText className="h-10 w-10 text-brand-dark-gray mx-auto mb-3" />
            <p className="text-brand-dark-gray mb-4">No conversions yet</p>
            <Link href="/upload" className="btn-primary inline-block">
              Upload your first PDF
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-brand-light-gray">
            <div className="bg-brand-light-gray/50 px-4 py-3 grid grid-cols-3 gap-4">
              <span className="text-brand-dark-gray text-xs uppercase tracking-wide font-medium">ID</span>
              <span className="text-brand-dark-gray text-xs uppercase tracking-wide font-medium">Date</span>
              <span className="text-brand-dark-gray text-xs uppercase tracking-wide font-medium text-right">Status</span>
            </div>
            {conversions.items.map((conv: Conversion) => (
              <Link href={`/conversions/${conv.id}`} key={conv.id}>
                <div className="bg-white border-b border-brand-light-gray hover:bg-[#F9F9F9] px-4 py-3 grid grid-cols-3 gap-4 items-center transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-brand-dark-gray" />
                    <span className="font-medium text-sm text-brand-black">{conv.id.slice(0, 8)}...</span>
                  </div>
                  <span className="text-sm text-brand-dark-gray">
                    {new Date(conv.created_at).toLocaleDateString()}
                  </span>
                  <div className="text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses[conv.status] || "bg-brand-light-gray text-brand-dark-gray"}`}>
                      {conv.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
