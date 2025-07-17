"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Perm } from "@/lib/auth/permissions";
import { API_BASE_URL } from "@/lib/constants";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import { useHasPerm } from "../contexts/authz-provider";
import { EditLoanApplicationForm } from "./edit-loan-application-form";
import { loanApplicationTableColumns } from "./loan-application-table-columns";
import { LoanApplicationDTO } from "./loan-application.schema";
import { useSocket } from "@/hooks/use-socket";
import { fetchApi } from "@/lib/fetch-api";

export function LoanApplicationList() {
  const canEdit = useHasPerm(Perm.LOAN_UPDATE);
  const [editing, setEditing] = useState<LoanApplicationDTO | null>(null);

  /* ─────────── React-Query ─────────── */
  const qc = useQueryClient();

  const {
    data: apps = [],
    isPending,
    error,
  } = useQuery<LoanApplicationDTO[]>({
    queryKey: ["loan-apps"],
    queryFn: async () => {
      const res = await fetchApi<LoanApplicationDTO[]>(
        `${API_BASE_URL}/loan-applications`,
      );
      return res;
    },
    refetchOnWindowFocus: false,
  });

  /* ─────────── Live invalidation over WS ─────────── */
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return; // wait until socket is ready
    const handler = () => qc.invalidateQueries({ queryKey: ["loan-apps"] });
    socket.on("loan-status", handler);
    return () => {
      socket.off("loan-status", handler);
    };
  }, [socket, qc]);

  /* ─────────── UI states ─────────── */
  if (isPending) return <p>Loading loan applications…</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!apps.length) return <p>No applications yet.</p>;

  return (
    <>
      <DataTable
        columns={loanApplicationTableColumns}
        data={apps}
        meta={{ setEditing, canEdit }}
      />

      {canEdit && (
        <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <SheetContent side="right" className="flex flex-col gap-6 w-[26rem]">
            {editing && (
              <>
                <SheetHeader>
                  <SheetTitle>
                    Edit application {editing.id.slice(0, 8)}…
                  </SheetTitle>
                </SheetHeader>

                <EditLoanApplicationForm
                  app={editing}
                  onSuccess={(updated) => {
                    /** update cache in-place, no extra state needed */
                    qc.setQueryData<LoanApplicationDTO[]>(
                      ["loan-apps"],
                      (old) =>
                        old
                          ? old.map((a) => (a.id === updated.id ? updated : a))
                          : [updated],
                    );
                    setEditing(null);
                  }}
                  onCancel={() => setEditing(null)}
                />
              </>
            )}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
