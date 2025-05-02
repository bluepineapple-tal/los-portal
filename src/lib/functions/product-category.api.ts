import {
  ICreateProductCategory,
  IProductCategory,
} from "@/components/product-categories/product-category.interface";

import { API_BASE_URL } from "../constants";
import { fetchApi } from "../fetch-api";

/**
 * Creates a new product Category using the provided data.
 *
 * @param data The new product Category payload
 * @returns The newly created product Category (as returned by the server)
 */
export async function createProductCategory(
  data: ICreateProductCategory,
): Promise<IProductCategory> {
  return fetchApi<IProductCategory>(`${API_BASE_URL}/product-categories`, {
    method: "POST",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Updates an existing product Category.
 *
 * @param id The product Category ID to update.
 * @param data The fields to update.
 * @returns The updated product Category.
 */
export async function updateProductCategory(
  id: string,
  data: Partial<ICreateProductCategory>,
): Promise<IProductCategory> {
  return fetchApi<IProductCategory>(`${API_BASE_URL}/product-category/${id}`, {
    method: "PUT",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Deletes a product category.
 *
 * @param id The product Category ID to delete.
 * @returns A success message or error information.
 */
export async function deleteProductCategory(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return fetchApi<{ success: boolean; message?: string }>(
    `${API_BASE_URL}/product-category/${id}`,
    {
      method: "DELETE",
    },
  );
}
