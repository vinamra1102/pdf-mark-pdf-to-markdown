"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History as HistoryIcon } from "lucide-react";
import { useConversions } from "@/hooks/useConversions";
import { ConversionCard } from "@/components/ConversionCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <HistoryIcon className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">History</h1>
        </div>
        <p className="text-muted-foreground">Browse all your PDF conversions</p>
      </motion.div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.label}
            variant={status === tab.value ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !data?.items?.length ? (
        <Card>
          <CardContent className="p-8 text-center">
            <HistoryIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No conversions found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {data.items.map((conv) => (
              <ConversionCard key={conv.id} conversion={conv} />
            ))}
          </div>

          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {isFetching && !isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
}
