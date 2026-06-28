"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConversionStatus } from "@/types";
import type { Conversion } from "@/types";

const statusBadgeVariant: Record<string, "default" | "success" | "warning" | "destructive"> = {
  [ConversionStatus.PENDING]: "warning",
  [ConversionStatus.PROCESSING]: "default",
  [ConversionStatus.COMPLETED]: "success",
  [ConversionStatus.FAILED]: "destructive",
};

interface ConversionCardProps {
  conversion: Conversion;
}

export function ConversionCard({ conversion }: ConversionCardProps) {
  return (
    <Link href={`/conversions/${conversion.id}`}>
      <Card className="hover:border-primary/30 transition-colors cursor-pointer group">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{conversion.id.slice(0, 10)}...</p>
              <p className="text-xs text-muted-foreground">
                {new Date(conversion.created_at).toLocaleDateString()} · {new Date(conversion.created_at).toLocaleTimeString()}
              </p>
              {conversion.pdf_type && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {conversion.pdf_type} · {conversion.page_count ?? "?"} pages
                  {conversion.processing_time_ms && ` · ${(conversion.processing_time_ms / 1000).toFixed(1)}s`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={statusBadgeVariant[conversion.status] || "default"}>
              {conversion.status}
            </Badge>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
