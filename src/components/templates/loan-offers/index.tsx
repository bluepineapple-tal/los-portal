"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { LoanOfferList } from "@/components/loan-offers/loan-offer-list";
import { RequirePerm } from "@/components/auth/RequirePerm";
import { Perm } from "@/lib/auth/permissions";

export const LoanOffersPageTemplate = () => {
  const session = useSessionContext();
  // Check session
  if (session.loading) {
    return <div>Loading Session...</div>;
  }
  if (session.doesSessionExist === false) {
    return <div>Session does not exist</div>;
  }

  return (
    <RequirePerm perms={[Perm.LOAN_READ]}>
      <div className="p-6">
        <h1 className="mb-4 text-xl font-bold">Loan Offers</h1>
        {/* Loan Offers List */}
        <LoanOfferList />
      </div>
    </RequirePerm>
  );
};
