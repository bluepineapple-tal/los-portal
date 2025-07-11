import { FC } from "react";

import { ConfirmationCard } from "@/components/loan-applications/confirm-loan-application";
import { LoanApplicationList } from "@/components/loan-applications/loan-application-list";

const LoanApplicationsTemplate: FC = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Loan Offers</h1>

      <LoanApplicationList />
      
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ConfirmationCard
          creditScore={349}
          kycStatus="verified"
          loanStatus="approved"
          loanDetails={{
            amount: "₹10,00,000",
            interestRate: "8.5%",
            tenure: "5 years",
            emiAmount: "₹21,000",
          }}
          applicantDetails={{
            name: "John Doe",
            panNumber: "ABCDE1234F",
            phoneNumber: "9876543210",
          }}
        />
      </div>
    </div>
  );
};

export default LoanApplicationsTemplate;
