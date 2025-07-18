import { z } from "zod";

import {
  applicationStatusEnum,
  sourceOfIncomeEnum,
} from "./loan-application.schema";

export const createLoanApplicationSchema = z.object({
  monthly_income: z
    .number({ required_error: "Monthly Income is required" })
    .min(0, "Min ₹0"),

  source_of_income: sourceOfIncomeEnum,
  /* references ---------------------------------------------------- */
  productCategoryId: z.string().uuid(),
  loanOfferId: z.string().uuid(),

  /* amount -------------------------------------------------------- */
  requested_amount: z
    .number({ required_error: "Amount is required" })
    .min(1000, "Min ₹1 000"),

  /* optional status / date (leave blank, BE will fill) ----------- */
  application_date: z.date().optional(),
  status: applicationStatusEnum.optional(),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "You must give consent to proceed.",
    }),
  }),
});

export type ICreateLoanApplication = z.infer<
  typeof createLoanApplicationSchema
>;

export interface CreateLoanApplicationPayload extends ICreateLoanApplication {
  consumerId: string; // inject on the client
}
