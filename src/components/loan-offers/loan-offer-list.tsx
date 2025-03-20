"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { API_BASE_URL } from "@/lib/constants";

import { ILoanOffer, loanOfferTableColumns } from "./loan-offer-table-columns";

export function LoanOfferList({
  makeId,
  modelId,
}: Readonly<{
  makeId: string;
  modelId: string;
}>) {
  const [offers, setOffers] = useState<ILoanOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch loan offers for the selected Make and Model
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/loan-offers/product-model/${modelId}`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch loan offers: ${response.statusText}`,
          );
        }

        const data = (await response.json()) as ILoanOffer[];
        setOffers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [makeId, modelId]);

  if (loading) return <p>Loading Loan Offers...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!offers.length) return <p>No loan offers found for this product.</p>;

  return (
    <DataTable
      columns={loanOfferTableColumns}
      data={offers}
      filterColumnId="offer_name"
    />
  );
}
