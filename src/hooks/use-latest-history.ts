"use client";
import { API_BASE_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

interface HistoryRecord {
  change_note?: string;
  new_status: string;
}

export function useLatestHistory(appId: string) {
  return useQuery<HistoryRecord | null>({
    queryKey: ["loan-history-latest", appId],
    queryFn: () =>
      fetch(`${API_BASE_URL}/loan-applications/history/latest/${appId}`).then(
        (r) => r.json(),
      ),
    staleTime: 0, // always refetch when invalidated
    refetchOnWindowFocus: false,
  });
}
