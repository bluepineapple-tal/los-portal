import { z } from "zod";

import { loanOfferSchema } from "../loan-offers/loan-offer.schema";
import { productCategorySchema } from "../product-categories/product-category.schema";
import { consumerProfileWithUserSchema } from "../onboarding/user.schema";

/*  Enum helper—​keep the strings in sync with the NestJS `ApplicationStatus`  */
export const applicationStatusEnum = z.enum([
  "draft",
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "escalated",
  "claimed",
] as const);

export const sourceOfIncomeEnum = z.enum([
  "salaried",
  "self_employed",
  "business",
  "other",
] as const);

export const kycStatusEnum = z.enum(["verified", "failed", "pending"] as const);
export type KycStatus = z.infer<typeof kycStatusEnum>;
export type ApplicationStatus = z.infer<typeof applicationStatusEnum>;

const creditCheckSchema = z.object({ credit_score: z.number() }).passthrough();
const kycCheckSchema = z.object({ status: kycStatusEnum }).passthrough();

export const loanApplicationSchema = z.object({
  id: z.string().uuid(),
  status: applicationStatusEnum,
  application_date: z.coerce.date(),
  requested_amount: z.number(),
  manual_review_needed: z.boolean(),

  /* audit */
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),

  /* relations */
  selectedOffer: loanOfferSchema,
  productCategory: productCategorySchema,

  /* consumer snapshot */
  consumer: consumerProfileWithUserSchema,

  /* KYC snapshot */
  monthly_income: z.number(),
  source_of_income: sourceOfIncomeEnum,

  externalChecks: z
    .object({
      kyc: kycCheckSchema.optional(),
      aml: z.unknown().optional(),
      credit: creditCheckSchema.optional(),
    })
    .optional(),
});

/*  Convenience TS type                                                       */
export type LoanApplicationDTO = z.infer<typeof loanApplicationSchema>;
