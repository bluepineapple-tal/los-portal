"use client";
import { API_BASE_URL } from "@/lib/constants";
import { fetchApi } from "@/lib/fetch-api";
import { useQuery } from "@tanstack/react-query";

interface HistoryRecord {
  change_note?: string;
  new_status: string;
}

export function useLatestHistory(appId: string) {
  return useQuery<HistoryRecord | null>({
    queryKey: ["loan-history-latest", appId],
    queryFn: () =>
      fetchApi(`${API_BASE_URL}/loan-applications/history/latest/${appId}`),
    staleTime: 0, // always refetch when invalidated
    refetchOnWindowFocus: false,
  });
}
