import { z } from "zod";

import { ProductStatus } from "@/components/products/product.interface";

export const createProductMakeSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long" })
    .max(100, { message: "Product name must be at most 100 characters long" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description must be at most 1000 characters long" }),

  status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
});
