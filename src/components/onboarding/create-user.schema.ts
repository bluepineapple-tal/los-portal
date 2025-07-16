import { z } from "zod";

const PHONE_10_DIGIT = /^\d{10}$/;
const PIN_6_DIGIT = /^\d{6}$/;
const PAN_REGEX = /^[A-Z]{5}\d{4}[A-Z]$/;
const AADHAAR_REGEX = /^[2-9]\d{11}$/;

export const createUserSchema = z.object({
  supertokensUserId: z.string(),
  /* identity ------------------------------------------------------- */
  first_name: z
    .string()
    .min(2, "First name must contain at least 2 characters"),
  last_name: z.string().min(2, "Last name must contain at least 2 characters"),
  date_of_birth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  country: z.string().default("India"),
  marital_status: z.enum(["single", "married", "divorced", "widowed"], {
    errorMap: () => ({ message: "Marital status is required" }),
  }),
  /* contact -------------------------------------------------------- */
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(PHONE_10_DIGIT, "Must be exactly 10 digits"),
  /* address -------------------------------------------------------- */
  street1: z.string().min(3, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pin_code: z.string().regex(PIN_6_DIGIT, "PIN code must be 6 numeric digits"),
  /* KYC -------------------------------------------------------- */
  aadhar_number: z
    .string()
    .regex(
      AADHAAR_REGEX,
      "Aadhaar must be 12 digits & cannot start from 0 or 1",
    ),
  pan_number: z
    .string()
    .regex(
      PAN_REGEX,
      "PAN must be 10 characters (5 letters, 4 digits, 1 letter)",
    ),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
