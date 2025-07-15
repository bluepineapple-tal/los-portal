import { FC } from "react";

import { RequirePerm } from "@/components/auth/RequirePerm";
import { LoanApplicationList } from "@/components/loan-applications/loan-application-list";
import { Perm } from "@/lib/auth/permissions";

const LoanApplicationsTemplate: FC = () => {
  return (
    <RequirePerm perms={[Perm.LOAN_READ]}>
      <div className="p-6">
        <h1 className="mb-4 text-xl font-bold">Loan Offers</h1>

        <LoanApplicationList />
      </div>
    </RequirePerm>
  );
};

export default LoanApplicationsTemplate;
