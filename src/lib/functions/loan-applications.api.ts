import {
  CreateLoanApplicationPayload,
  ICreateLoanApplication,
} from "@/components/loan-applications/create-loan-application.schema";
import { API_BASE_URL } from "../constants";
import { fetchApi } from "../fetch-api";
import { ILoanApplication } from "@/components/loan-applications/loan-application.schema";

/**
 * Fetch **all** loan applications from the server.
 *
 * @returns Array of `LoanApplication` objects.
 */
export async function getLoanApplications(): Promise<ILoanApplication[]> {
  return fetchApi<ILoanApplication[]>(`${API_BASE_URL}/loan-applications`, {
    method: "GET",
  });
}

/**
 * Fetch a single loan application by its ID.
 *
 * @param id The UUID of the loan application.
 * @returns The matching `LoanApplication`.
 */
export async function getLoanApplication(
  id: string,
): Promise<ILoanApplication> {
  return fetchApi<ILoanApplication>(`${API_BASE_URL}/loan-applications/${id}`, {
    method: "GET",
  });
}

/**
 * Create a new loan application.
 *
 * @param data Payload validated by `createLoanApplicationSchema`.
 * @returns The newly created `LoanApplication`.
 */
export async function createLoanApplication(
  data: CreateLoanApplicationPayload,
): Promise<ILoanApplication> {
  return fetchApi<ILoanApplication>(`${API_BASE_URL}/loan-applications`, {
    method: "POST",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Update an existing loan application.
 *
 * @param id   The UUID of the application to update.
 * @param data Partial payload with the fields you want to modify.
 * @returns The updated `LoanApplication`.
 */
export async function updateLoanApplication(
  id: string,
  data: Partial<ICreateLoanApplication>,
): Promise<ILoanApplication> {
  return fetchApi<ILoanApplication>(`${API_BASE_URL}/loan-applications/${id}`, {
    method: "PUT",
    // @ts-expect-error body init type
    body: data,
  });
}

/**
 * Delete (hard-delete) a loan application by ID.
 *
 * @param id The UUID of the record to remove.
 * @returns `{ success: boolean }`
 */
export async function deleteLoanApplication(
  id: string,
): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(
    `${API_BASE_URL}/loan-applications/${id}`,
    { method: "DELETE" },
  );
}
