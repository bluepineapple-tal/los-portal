import {
  ICreateLoanOffer,
  ILoanOffer,
} from "@/components/loan-offers/loan.interface";

import { API_BASE_URL } from "../constants";
import { fetchApi } from "../fetch-api";

/**
 * Fetches loan offers using the provided data.
 *
 * @param data The fetch loan offers payload
 * @returns The list of loan offers (as returned by the server)
 */
export async function getLoanOffersByModelId(data: {
  productModelId: string;
}): Promise<ILoanOffer[]> {
  return fetchApi<ILoanOffer[]>(
    `${API_BASE_URL}/loan-offers/${data.productModelId}`,
    {
      method: "GET",
      // @ts-expect-error body init type
      body: data,
    },
  );
}

/**
 * Creates a new loan offer using the provided data.
 *
 * @param data The new loan offer payload
 * @returns The newly created loan offer (as returned by the server)
 */
export async function createLoanOffer(
  data: ICreateLoanOffer,
): Promise<ILoanOffer> {
  console.log(data);
  return fetchApi<ILoanOffer>(`${API_BASE_URL}/loan-offers`, {
    method: "POST",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Updates an existing loan offer.
 *
 * @param id The loan offer ID to update.
 * @param data The fields to update.
 * @returns The updated loan offer.
 */
export async function updateLoanOffer(
  id: string,
  data: Partial<ICreateLoanOffer>,
): Promise<ILoanOffer> {
  return fetchApi<ILoanOffer>(`${API_BASE_URL}/loan-offers/${id}`, {
    method: "PUT",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Deletes a loan offer.
 *
 * @param id The loan offer ID to delete.
 * @returns A success message or error information.
 */
export async function deleteLoanOffer(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return fetchApi<{ success: boolean; message?: string }>(
    `${API_BASE_URL}/loan-offers/${id}`,
    {
      method: "DELETE",
    },
  );
}
