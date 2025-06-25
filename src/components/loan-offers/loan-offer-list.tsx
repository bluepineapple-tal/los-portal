"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { API_BASE_URL } from "@/lib/constants";

import { loanOfferTableColumns } from "./loan-offer-table-columns";
import { ILoanOffer } from "./loan-offer.schema";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { EditLoanOfferForm } from "./edit-loan-offer-form";

export function LoanOfferList() {
  const [offers, setOffers] = useState<ILoanOffer[]>([]);
  const [editing, setEditing] = useState<ILoanOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  // Fetch loan offers for the selected Make and Model
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/loan-offers/`);

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
  }, []);

  if (loading) return <p>Loading Loan Offers...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!offers.length) return <p>No loan offers found for this product.</p>;

  return (
    <>
      <DataTable
        key={version}
        columns={loanOfferTableColumns}
        data={offers}
        meta={{ setEditing }}
        onReorder={(prev, next) => {
          /* Persist new order to backend if needed */
          return next;
        }}
      />

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent side="right" className="flex flex-col gap-6">
          {editing && (
            <>
              <SheetHeader>
                <SheetTitle>Edit “{editing.offer_name}”</SheetTitle>
              </SheetHeader>

              <EditLoanOfferForm
                offer={editing}
                onSuccess={(updated) => {
                  // update row in local state -> instant optimistic UI
                  setOffers((prev) =>
                    prev.map((o) => (o.id === updated.id ? updated : o)),
                  );
                  setVersion((v) => v + 1);
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
