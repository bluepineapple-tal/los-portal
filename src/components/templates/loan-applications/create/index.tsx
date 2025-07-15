"use client";
import { FC, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { RequirePerm } from "@/components/auth/RequirePerm";
import { ConfirmationCard } from "@/components/loan-applications/confirm-loan-application";
import { CreateLoanApplicationForm } from "@/components/loan-applications/create-loan-application-form";
import { LoanApplicationDTO } from "@/components/loan-applications/loan-application.schema";
import { LoanOfferDTO } from "@/components/loan-offers/loan-offer.schema";
import { ProductCategoryDTO } from "@/components/product-categories/product-category.schema";
import { Perm } from "@/lib/auth/permissions";

const CreateLoanApplicationTemplate: FC<
  ICreateLoanApplicationTemplateProps
> = ({ offers, categories }) => {
  const session = useSessionContext();

  const [showForm, setShowForm] = useState<boolean>(true);
  const [application, setApplication] = useState<LoanApplicationDTO | null>(
    null,
  );

  if (session.loading) {
    return null;
  }
  const userId = session.userId;

  const onFormSubmit = (app: LoanApplicationDTO) => {
    setShowForm(false);
    setApplication(app);
  };

  return (
    <RequirePerm perms={[Perm.LOAN_CREATE]}>
      <div className="p-6 max-w-screen-lg">
        {showForm ? (
          <CreateLoanApplicationForm
            userId={userId}
            offers={offers}
            categories={categories}
            onFormSubmit={onFormSubmit}
          />
        ) : null}

        {!showForm && application ? (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ConfirmationCard
              creditScore={349}
              kycStatus="verified"
              loanStatus="approved"
              loanDetails={{
                amount: application.requested_amount,
                interestRate: +application.selectedOffer.interest_rate,
                tenureMonths: +application.selectedOffer.tenure_months,
                emiAmount: 21000,
              }}
              applicant={{
                name: `${application.consumer.user.first_name} ${application.consumer.user.last_name}`,
                panNumber: application.consumer.pan_number,
                phoneNumber: application.consumer.user.phone,
                monthlyIncome: application.consumer.monthly_income,
                sourceOfIncome: application.consumer.source_of_income,
              }}
            />
          </div>
        ) : null}
      </div>
    </RequirePerm>
  );
};

export default CreateLoanApplicationTemplate;

interface ICreateLoanApplicationTemplateProps {
  offers: LoanOfferDTO[];
  categories: ProductCategoryDTO[];
}
