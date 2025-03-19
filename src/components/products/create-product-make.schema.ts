import { z } from "zod";

import { ProductStatus } from "@/components/products/product.interface";

export const createProductMakeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Make name cannot be empty" })
    .max(100, { message: "Make name must not be more than 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must contain a minimun of 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),

  status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
});
