"use client";

import { useEffect } from "react";

import { LoanApplicationDTO } from "@/components/loan-applications/loan-application.schema";
import { useSocket } from "@/hooks/use-socket";
import { API_BASE_URL } from "@/lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useLoanApplication(id: string) {
  const qc = useQueryClient();
  const socket = useSocket(); // can be undefined on first render

  /* REST fetch */
  const query = useQuery<LoanApplicationDTO>({
    queryKey: ["loan-app", id],
    queryFn: () =>
      fetch(`${API_BASE_URL}/loan-applications/${id}`).then((r) => r.json()),
    refetchOnWindowFocus: false,
  });

  /* Live updates */
  useEffect(() => {
    if (!socket) return; // wait until socket is ready

    socket.emit("subscribe-loan", id);

    const onStatus = (evt: { applicationId: string; newStatus: string }) => {
      if (evt.applicationId === id) {
        qc.invalidateQueries({ queryKey: ["loan-app", id] });
      }
    };

    socket.on("loan-status", onStatus);
    return () => {
      socket.off("loan-status", onStatus);
      socket.emit("unsubscribe-loan", id);
    };
  }, [socket, id, qc]);

  return query;
}
