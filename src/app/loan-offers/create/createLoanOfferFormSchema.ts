import { z } from "zod";

export const createLoanOfferSchema = z
  .object({
    // Name/title of the offer
    offer_name: z
      .string()
      .min(3, { message: "Offer name must contain a minimum of 3 characters" })
      .max(100, { message: "Offer name must not exceed 100 characters" }),

    // Interest rate percentage (e.g., 7.5)
    interest_rate: z
      .number()
      .min(0.0, { message: "Interest rate must not be less than 0%" })
      .max(100, { message: "Interest rate must not exceed 100%" })
      .multipleOf(0.01, {
        message: "Interest rate must be a valid decimal value",
      }),

    // Number of months for the loan (e.g., 12, 24, 36)
    tenure_months: z
      .number()
      .int({ message: "Tenure must be an integer number of months" })
      .min(1, { message: "Tenure must be at least 1 month" })
      .max(60, { message: "Tenure must be at most 60 months" }),

    // Minimum loan amount for the loan in INR (e.g., 50,000, 100,000)
    min_amount: z
      .number({ invalid_type_error: "Minimum amount must be a number" })
      .int({ message: "Amount must be an integer number" })
      .min(10000, { message: "Amount must be at least INR 10,000" })
      .max(10000000, { message: "Amount must be at most INR 1,00,00,000" })
      .nonnegative({ message: "Minimum must be a positive number" }),

    // Maximum loan amount for the loan in INR (e.g., 50,000, 100,000)
    max_amount: z
      .number()
      .int({ message: "Amount must be an integer number" })
      .min(10000, { message: "Amount must be at least INR 10,000" })
      .max(10000000, { message: "Amount must be at most INR 1,00,00,000" })
      .nonnegative({ message: "Minimum must be a positive number" }),

    valid_from: z.date({
      required_error: "A date of birth is required.",
    }),

    valid_to: z.date({
      required_error: "A date of birth is required.",
    }),

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
    is_active: z.boolean().default(false),
  })
  .refine((data) => data.min_amount < data.max_amount, {
    message: "Minimum amount must be less than Maximum amount",
    path: ["min_amount"], // or use ["max_amount"] depending on where you want the error
  })
  // FIXME: Remove this error if the loan offer form is fixed
  .refine((data) => data.valid_from <= data.valid_to, {
    message: "Valid from date cannot be greater than valid to",
    path: ["min_amount"], // or use ["max_amount"] depending on where you want the error
  });
