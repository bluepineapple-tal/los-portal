import {
  ICreateProductModel,
  IProductModel,
} from "@/components/products/product.interface";

import { API_BASE_URL } from "../constants";
import { fetchApi } from "../fetch-api";

/**
 * Creates a new product model using the provided data.
 *
 * @param data The new product model payload
 * @returns The newly created product model (as returned by the server)
 */
export async function createProductModel(
  data: ICreateProductModel,
): Promise<IProductModel> {
  return fetchApi<IProductModel>(`${API_BASE_URL}/product-model`, {
    method: "POST",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Updates an existing product model.
 *
 * @param id The product model ID to update.
 * @param data The fields to update.
 * @returns The updated product model.
 */
export async function updateProductModel(
  id: string,
  data: Partial<ICreateProductModel>,
): Promise<IProductModel> {
  return fetchApi<IProductModel>(`${API_BASE_URL}/product-model/${id}`, {
    method: "PUT",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Deletes a product model.
 *
 * @param id The product model ID to delete.
 * @returns A success message or error information.
 */
export async function deleteProductModel(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return fetchApi<{ success: boolean; message?: string }>(
    `${API_BASE_URL}/product-model/${id}`,
    {
      method: "DELETE",
    },
  );
}
