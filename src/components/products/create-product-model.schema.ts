import { z } from "zod";

import { ProductStatus } from "@/components/products/product.interface";

export const createProductModelSchema = z.object({
  makeId: z.string().uuid({ message: "Please select a make" }),

  name: z
    .string()
    .min(1, { message: "Model name cannot be empty" })
    .max(100, { message: "Model name must be at most 100 characters long" }),

  description: z
    .string()
    .min(10, { message: "Description must contain a minimun of 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),

  price: z
    .number()
    .min(0.01, { message: "Price must be greater than 0" })
    .max(1000000, { message: "Price must be less than 1,000,000" })
    .multipleOf(0.01, { message: "Price must be a valid decimal number" }),

  status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
});
