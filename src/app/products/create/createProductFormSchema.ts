import { z } from "zod";

import { ProductStatus } from "@/components/products/columns";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long" })
    .max(100, { message: "Product name must be at most 100 characters long" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description must be at most 1000 characters long" }),

  price: z
    .number()
    .min(0.01, { message: "Price must be at least 0.01" })
    .max(999999.99, { message: "Price must be less than 1,000,000" })
    .multipleOf(0.01, { message: "Price must be a valid decimal number" }),

  status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),

  vendorId: z.string().uuid({ message: "Vendor ID must be a valid UUID" }),
});
