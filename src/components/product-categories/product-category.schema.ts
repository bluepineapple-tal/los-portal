import { z } from "zod";

/*  Enum – keep values 1-to-1 with backend `ProductCategoryStatus`            */
export const productCategoryStatusEnum = z.enum([
  "active",
  "inactive",
  "discontinued",
] as const);

export const productCategorySchema = z.object({
  id: z.string().uuid(),

  name: z
    .string()
    .min(2, "Name must contain at least 2 characters")
    .max(120, "Name must not exceed 120 characters"),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  status: productCategoryStatusEnum,

  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type ProductCategoryDTO = z.infer<typeof productCategorySchema>;
