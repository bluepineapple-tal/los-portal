// import { FC } from "react";
import { ConfirmationCard } from "@/components/loan-applications/confirm-loan-application";

// const LoanApplicationsTemplate: FC = () => {
//   return <div>LoanApplicationsTemplate</div>;
// };

// export default LoanApplicationsTemplate;

export default function ConfirmationPage() {
  // You would typically fetch this from API or props
  // const creditScore = 200;
  // const kycStatus = "verified";
  // const loanStatus = "approved";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
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
  );
}
