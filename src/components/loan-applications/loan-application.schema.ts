import { z } from "zod";

import { loanOfferSchema } from "../loan-offers/loan-offer.schema";
import { productCategorySchema } from "../product-categories/product-category.schema";

/*  Enum helper—​keep the strings in sync with the NestJS `ApplicationStatus`  */
export const applicationStatusEnum = z.enum([
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "escalated",
] as const);

export const sourceOfIncomeEnum = z.enum([
  "salaried",
  "self_employed",
  "business",
  "other",
] as const);

export const loanApplicationSchema = z.object({
  id: z.string().uuid(),

  status: applicationStatusEnum,

  application_date: z.coerce.date(),

  requested_amount: z.number().optional(),

  manual_review_needed: z.boolean(),

  created_at: z.coerce.date(),

  updated_at: z.coerce.date(),

  loan_offer: loanOfferSchema.optional(),

  productCategory: productCategorySchema,

  monthly_income: z.number(),

  source_of_income: sourceOfIncomeEnum,
});

/* -------------------------------------------------------------------------- */
/*  Convenience TS type                                                       */
/* -------------------------------------------------------------------------- */
export type ILoanApplication = z.infer<typeof loanApplicationSchema>;
