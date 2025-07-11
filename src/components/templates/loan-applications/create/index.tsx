"use client";
import { FC } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { CreateLoanApplicationForm } from "@/components/loan-applications/create-loan-application-form";
import { LoanOfferDTO } from "@/components/loan-offers/loan-offer.schema";

import { ProductCategoryDTO } from "@/components/product-categories/product-category.schema";

const CreateLoanApplicationTemplate: FC<
  ICreateLoanApplicationTemplateProps
> = ({ offers, categories }) => {
  const session = useSessionContext();

  if (session.loading) {
    return null;
  }
  const userId = session.userId;

  return (
    <div className="p-6 max-w-screen-lg">
      <CreateLoanApplicationForm
        userId={userId}
        offers={offers}
        categories={categories}
      />
    </div>
  );
};

export default CreateLoanApplicationTemplate;

interface ICreateLoanApplicationTemplateProps {
  offers: LoanOfferDTO[];
  categories: ProductCategoryDTO[];
}
