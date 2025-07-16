// los-portal/src/app/loan-applications/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";

import { RequirePerm } from "@/components/auth/RequirePerm";
import { LoanApplicationStatusCard } from "@/components/loan-applications/loan-application-status-card";
import { useLatestHistory } from "@/hooks/use-latest-history";
import { useLoanApplication } from "@/hooks/use-loan-application";
import { Perm } from "@/lib/auth/permissions";

export default function LoanApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: app, isPending, error } = useLoanApplication(id);
  const { data: latest } = useLatestHistory(id);

  if (isPending)
    return (
      <p className="flex h-screen w-full items-center justify-center">
        Loading …
      </p>
    );
  if (error instanceof Error)
    return (
      <p className="text-red-600 text-center mt-20">Error: {error.message}</p>
    );
  if (!app) return null;

  const note =
    app?.status === "rejected" || app?.status === "under_review"
      ? latest?.change_note
      : undefined;

  return (
    <RequirePerm perms={[Perm.LOAN_READ]}>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <LoanApplicationStatusCard
          app={app}
          creditScore={app.externalChecks?.credit?.credit_score}
          kycStatus={app.externalChecks?.kyc?.status}
          note={note}
        />
      </div>
    </RequirePerm>
  );
}
