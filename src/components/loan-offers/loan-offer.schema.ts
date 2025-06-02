import { z } from "zod";

export const loanOfferSchema = z.object({
  id: z.string(),
  productId: z.string(),
  offer_name: z.string(),

  interest_rate: z.string(),
  tenure_months: z.string(),
  processing_fee: z.string(),
  min_amount: z.string(),
  max_amount: z.string(),

  offer_details: z.string().optional(),
  is_active: z.coerce.boolean(),
  created_at: z.union([z.string(), z.date()]),
  updated_at: z.union([z.string(), z.date()]),
});

export type ILoanOffer = z.infer<typeof loanOfferSchema>;
