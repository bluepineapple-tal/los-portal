import {
  ICreateProductMake,
  IProductMake,
} from "@/components/products/product.interface";

import { API_BASE_URL } from "../constants";
import { fetchApi } from "../fetch-api";

/**
 * Creates a new product make using the provided data.
 *
 * @param data The new product make payload
 * @returns The newly created product make (as returned by the server)
 */
export async function createProductMake(
  data: ICreateProductMake,
): Promise<IProductMake> {
  return fetchApi<IProductMake>(`${API_BASE_URL}/product-make`, {
    method: "POST",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Updates an existing product make.
 *
 * @param id The product make ID to update.
 * @param data The fields to update.
 * @returns The updated product make.
 */
export async function updateProductMake(
  id: string,
  data: Partial<ICreateProductMake>,
): Promise<IProductMake> {
  return fetchApi<IProductMake>(`${API_BASE_URL}/product-make/${id}`, {
    method: "PUT",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Deletes a product make.
 *
 * @param id The product make ID to delete.
 * @returns A success message or error information.
 */
export async function deleteProductMake(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return fetchApi<{ success: boolean; message?: string }>(
    `${API_BASE_URL}/product-make/${id}`,
    {
      method: "DELETE",
    },
  );
}
