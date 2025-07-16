// los-portal/src/app/loan-applications/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";

import { LoanApplicationStatusCard } from "@/components/loan-applications/loan-application-status-card";
import { useLoanApplication } from "@/hooks/use-loan-application";

export default function LoanApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: app, isPending, error } = useLoanApplication(id);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <LoanApplicationStatusCard
        app={app}
        creditScore={app.externalChecks?.credit?.credit_score}
        kycStatus={app.externalChecks?.kyc?.status}
        rejectionNote={"rejected for some reason"}
      />
    </div>
  );
}
