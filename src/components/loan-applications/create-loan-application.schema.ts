import { z } from "zod";

const PHONE_10_DIGIT = /^\d{10}$/;
const PIN_6_DIGIT = /^\d{6}$/;
const AADHAR_12_DIGIT = /^[2-9]\d{11}$/;
const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/;

export const createLoanApplicationSchema = z
  .object({
    /* ---------------------------- Basic Details --------------------------- */
    first_name: z
      .string()
      .min(2, "First name must contain at least 2 characters"),
    last_name: z
      .string()
      .min(2, "Last name must contain at least 2 characters"),
    date_of_birth: z.date({
      required_error: "Date of birth is required",
    }),
    gender: z.enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Gender is required" }),
    }),
    country: z.string().default("India"),

    marital_status: z.enum(["Single", "Married", "Divorced", "Widowed"], {
      errorMap: () => ({ message: "Marital status is required" }),
    }),

    /* ----------------------------- Contact ------------------------------- */
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(PHONE_10_DIGIT, "Phone number must be exactly 10 digits"),
    alt_phone: z
      .string()
      .regex(PHONE_10_DIGIT, "Alt. phone must be exactly 10 digits")
      .optional(),

    /* ----------------------------- Address ------------------------------- */
    street1: z.string().min(3, "Street address is required"),
    street2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pin_code: z
      .string()
      .regex(PIN_6_DIGIT, "PIN code must be 6 numeric digits"),

    /* ---------------------------- Income --------------------------------- */
    monthly_income: z
      .number({ invalid_type_error: "Monthly income must be a number" })
      .int("Income must be an integer")
      .min(1000, "Income must be at least ₹1,000"),
    source_of_income: z.enum(
      ["Salaried", "Self-Employed", "Business", "Other"],
      { errorMap: () => ({ message: "Source of income is required" }) },
    ),

    /* -------------------------- Identification --------------------------- */
    aadhar_number: z
      .string()
      .regex(AADHAR_12_DIGIT, "Aadhaar must be 12 digits and start with 2-9"),
    aadhar_file: z.any().refine((f) => f instanceof File, {
      message: "Aadhaar file is required",
    }),

    pan_number: z
      .string()
      .regex(
        PAN_PATTERN,
        "PAN should be 10 chars: 5 letters, 4 digits, 1 letter (all caps)",
      ),
    pan_file: z.any().refine((f) => f instanceof File, {
      message: "PAN file is required",
    }),
  })
  .refine((data) => data.date_of_birth <= new Date(), {
    message: "Date of birth cannot be in the future",
    path: ["date_of_birth"],
  });

/** Convenience TypeScript helper */
export type ICreateLoanApplication = z.infer<
  typeof createLoanApplicationSchema
>;
