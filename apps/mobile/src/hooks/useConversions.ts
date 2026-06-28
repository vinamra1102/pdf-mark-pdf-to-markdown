import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ConversionDetail } from "@pdfmark/shared";

export function useConversions(page = 1, pageSize = 20, status?: string) {
  return useQuery({
    queryKey: ["conversions", page, pageSize, status],
    queryFn: () => api.conversions.list(page, pageSize, status),
  });
}

export function useConversion(id: string) {
  return useQuery({
    queryKey: ["conversions", id],
    queryFn: () => api.conversions.get(id),
    refetchInterval: (query) => {
      const data = query.state.data as ConversionDetail | undefined;
      if (data?.status === "pending" || data?.status === "processing") {
        return 3000;
      }
      return false;
    },
    enabled: !!id,
  });
}

export function useStartConversion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => api.conversions.start(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversions"] });
    },
  });
}
