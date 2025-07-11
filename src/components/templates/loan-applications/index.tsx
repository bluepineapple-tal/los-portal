import { FC } from "react";

import { LoanApplicationList } from "@/components/loan-applications/loan-application-list";

const LoanApplicationsTemplate: FC = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Loan Offers</h1>

      <LoanApplicationList />
    </div>
  );
};

export default LoanApplicationsTemplate;
