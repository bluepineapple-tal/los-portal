import { z } from "zod";
import { productCategoryStatusEnum } from "./product-category.schema";

export const createProductCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name cannot be empty" })
    .max(100, {
      message: "Category name must not be more than 100 characters",
    }),

  description: z
    .string()
    .min(10, { message: "Description must contain a minimun of 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),

  status: productCategoryStatusEnum,
});
