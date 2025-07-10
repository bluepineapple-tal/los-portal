import { z } from "zod";

/* reusable regex helpers -------------------------------------------------- */
const UUID = z.string().uuid();
const PHONE = z.string().regex(/^\d{10}$/, "Must be 10 digits exactly");

/* enums ------------------------------------------------------------------- */
export const roleEnum = z.enum([
  "consumer",
  "vendor",
  "nbfc_personnel",
  "underwriter",
  "admin",
]);

export const statusEnum = z.enum(["active", "inactive", "suspended"]);

export const genderEnum = z.enum(["male", "female", "other"]);
export const maritalEnum = z.enum(["single", "married", "divorced", "widowed"]);
export const incomeEnum = z.enum([
  "salaried",
  "self_employed",
  "business",
  "other",
]);

/* consumer profile -------------------------------------------------------- */
export const consumerProfileSchema = z.object({
  id: UUID,
  date_of_birth: z.string().datetime(), // ISO string from BE
  gender: genderEnum,
  marital_status: maritalEnum,
  alt_phone: PHONE.nullable(),
  street1: z.string(),
  street2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  pin_code: z.string().length(6),
  country: z.string(),
  monthly_income: z.number().nullable(),
  source_of_income: incomeEnum.nullable(),
  aadhar_number: z.string().nullable(),
  pan_number: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/* vendor profile – adjust fields as you add them -------------------------- */
export const vendorProfileSchema = z.null(); // currently always null

/* top-level user ---------------------------------------------------------- */
export const userSchema = z.object({
  id: UUID,
  supertokensUserId: UUID,
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  phone: PHONE,
  role: roleEnum,
  status: statusEnum,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  vendorProfile: vendorProfileSchema.nullable(),
  consumerProfile: consumerProfileSchema.nullable(),
});

/* exported TypeScript helpers -------------------------------------------- */
export type UserDTO = z.infer<typeof userSchema>;
export type ConsumerProfileDTO = z.infer<typeof consumerProfileSchema>;
