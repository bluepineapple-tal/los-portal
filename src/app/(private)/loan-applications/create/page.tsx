import { LoanOfferDTO } from "@/components/loan-offers/loan-offer.schema";
import { ProductCategoryDTO } from "@/components/product-categories/product-category.schema";
import CreateLoanApplicationTemplate from "@/components/templates/loan-applications/create";
import { API_BASE_URL } from "@/lib/constants";
import { fetchApi } from "@/lib/fetch-api";

export default async function CreateLoanApplication() {
  const [offers, categories] = await Promise.all([
    fetchApi<LoanOfferDTO[]>(`${API_BASE_URL}/loan-offers`),
    fetchApi<ProductCategoryDTO[]>(`${API_BASE_URL}/product-categories`),
  ]);

  return (
    <CreateLoanApplicationTemplate offers={offers} categories={categories} />
  );
}
