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

import { useHasPerm } from "../contexts/authz-provider";
import { EditLoanApplicationForm } from "./edit-loan-application-form";
import { loanApplicationTableColumns } from "./loan-application-table-columns";
import { LoanApplicationDTO } from "./loan-application.schema";

export function LoanApplicationList() {
  const [apps, setApps] = useState<LoanApplicationDTO[]>([]);
  const [editing, setEditing] = useState<LoanApplicationDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const canEdit = useHasPerm(Perm.LOAN_UPDATE);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/loan-applications`);
        if (!res.ok) throw new Error(res.statusText);
        setApps(await res.json());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading loan applications…</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!apps.length) return <p>No applications yet.</p>;

  return (
    <>
      <DataTable
        key={version}
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
                    setApps((prev) =>
                      prev.map((a) => (a.id === updated.id ? updated : a)),
                    );
                    setVersion((v) => v + 1);
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
