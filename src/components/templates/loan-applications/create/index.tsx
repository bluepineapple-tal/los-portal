"use client";
import { FC } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { RequirePerm } from "@/components/auth/RequirePerm";

import { CreateLoanApplicationForm } from "@/components/loan-applications/create-loan-application-form";
import { LoanOfferDTO } from "@/components/loan-offers/loan-offer.schema";
import { ProductCategoryDTO } from "@/components/product-categories/product-category.schema";
import { Perm } from "@/lib/auth/permissions";

const CreateLoanApplicationTemplate: FC<
  ICreateLoanApplicationTemplateProps
> = ({ offers, categories }) => {
  const session = useSessionContext();

  if (session.loading) {
    return null;
  }
  const userId = session.userId;

  return (
    <RequirePerm perms={[Perm.LOAN_CREATE]}>
      <div className="p-6 max-w-screen-lg">
        <CreateLoanApplicationForm
          userId={userId}
          offers={offers}
          categories={categories}
        />
      </div>
    </RequirePerm>
  );
};

export default CreateLoanApplicationTemplate;

interface ICreateLoanApplicationTemplateProps {
  offers: LoanOfferDTO[];
  categories: ProductCategoryDTO[];
}
