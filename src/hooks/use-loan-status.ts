import { useEffect, useState } from "react";

import { ApplicationStatus } from "@/components/loan-applications/loan-application.schema";

import { useSocket } from "./use-socket";

export function useLoanStatus(appId: string, initial: ApplicationStatus) {
  const [status, setStatus] = useState<ApplicationStatus>(initial);
  const [note, setNote] = useState<string | undefined>();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("subscribe-loan", appId);

    socket.on("loan-status", (evt) => {
      if (evt.applicationId === appId) {
        setStatus(evt.newStatus);
        setNote(evt.note);
      }
    });

    return () => {
      socket.off("loan-status");
      socket.emit("unsubscribe-loan", appId);
    };
  }, [appId, socket]);

  return { status, note };
}
