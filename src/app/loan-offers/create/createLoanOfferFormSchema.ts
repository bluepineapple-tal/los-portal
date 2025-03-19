import { z } from "zod";

export const createLoanOfferSchema = z.object({
  // The make id to which this offer applies
  productMakeId: z.string().uuid("Product Make ID must be a valid UUID"),

  // The model id to which this offer applies
  productModelId: z.string().uuid("Product Model ID must be a valid UUID"),

  // Name/title of the offer
  offer_name: z
    .string()
    .min(3, { message: "Offer name must be at least 3 characters long" })
    .max(100, { message: "Offer name must be at most 100 characters long" }),

  // Interest rate percentage (e.g., 7.5)
  interest_rate: z
    .number()
    .min(0.0, { message: "Interest rate must be at least 0.01%" })
    .max(100, { message: "Interest rate must be at most 100%" })
    .multipleOf(0.01, {
      message: "Interest rate must be a valid decimal value",
    }),

  // Number of months for the loan (e.g., 12, 24, 36)
  tenure_months: z
    .number()
    .int({ message: "Tenure must be an integer number of months" })
    .min(1, { message: "Tenure must be at least 1 month" })
    .max(60, { message: "Tenure must be at most 60 months" }),

  // Processing fee (can be zero or more, e.g., 999.99)
  processing_fee: z
    .number()
    .min(0, { message: "Processing fee cannot be negative" })
    .max(999999.99, { message: "Processing fee too large" })
    .multipleOf(0.01, {
      message: "Processing fee must be a valid decimal value",
    }),

  // Optional details about the offer
  offer_details: z
    .string()
    .max(1000, { message: "Offer details must be at most 1000 characters" })
    .optional(),

  // Whether the offer is active
  is_active: z.boolean().default(true),
});
