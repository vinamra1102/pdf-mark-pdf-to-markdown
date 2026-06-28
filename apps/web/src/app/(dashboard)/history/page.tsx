"use client";

import { useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import { useConversions } from "@/hooks/useConversions";
import { ConversionCard } from "@/components/ConversionCard";
import { ConversionStatus } from "@/types";

const tabs = [
  { label: "All", value: undefined },
  { label: "Completed", value: ConversionStatus.COMPLETED },
  { label: "Processing", value: ConversionStatus.PROCESSING },
  { label: "Failed", value: ConversionStatus.FAILED },
];

export default function HistoryPage() {
  const [status, setStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useConversions(page, 20, status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <HistoryIcon className="h-7 w-7 text-brand-orange" />
          <h1 className="text-3xl font-bold text-brand-black">History</h1>
        </div>
        <p className="text-brand-dark-gray">Browse all your PDF conversions</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={
              status === tab.value
                ? "btn-primary !px-4 !py-2 text-sm"
                : "btn-ghost !px-4 !py-2 text-sm"
            }
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-brand-light-gray/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !data?.items?.length ? (
        <div className="bg-white border border-brand-light-gray rounded-xl p-8 text-center">
          <HistoryIcon className="h-10 w-10 text-brand-dark-gray mx-auto mb-3" />
          <p className="text-brand-dark-gray">No conversions found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.items.map((conv) => (
              <ConversionCard key={conv.id} conversion={conv} />
            ))}
          </div>

          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-brand-dark-gray">
                Page {page} of {data.pages}
              </span>
              <button
                className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-50"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {isFetching && !isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-orange" />
        </div>
      )}
    </div>
  );
}
