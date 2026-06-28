"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, XCircle, Clock, Zap, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useConversions } from "@/hooks/useConversions";
import { ConversionStatus } from "@/types";
import type { Conversion } from "@/types";

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "destructive"> = {
  [ConversionStatus.PENDING]: "warning",
  [ConversionStatus.PROCESSING]: "default",
  [ConversionStatus.COMPLETED]: "success",
  [ConversionStatus.FAILED]: "destructive",
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.documents.getStats(),
  });

  const { data: conversions, isLoading: convsLoading } = useConversions(1, 5);

  const statCards = [
    { label: "Total Documents", value: stats?.total_documents ?? 0, icon: FileText, color: "text-primary" },
    { label: "Conversions", value: stats?.total_conversions ?? 0, icon: Zap, color: "text-blue-400" },
    { label: "Completed", value: stats?.completed_conversions ?? 0, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Failed", value: stats?.failed_conversions ?? 0, icon: XCircle, color: "text-red-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your PDF conversions</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                {statsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">{card.label}</span>
                      <card.icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Conversions</h2>
          <Link href="/history" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {convsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !conversions?.items?.length ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No conversions yet</p>
              <Link href="/upload">
                <Badge variant="default" className="cursor-pointer px-4 py-2">
                  Upload your first PDF
                </Badge>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversions.items.map((conv: Conversion) => (
              <Link href={`/conversions/${conv.id}`} key={conv.id}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{conv.id.slice(0, 8)}...</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(conv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusBadgeVariant[conv.status] || "default"}>
                      {conv.status}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
