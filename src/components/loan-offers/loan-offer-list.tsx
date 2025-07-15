"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { Perm } from "@/lib/auth/permissions";
import { API_BASE_URL } from "@/lib/constants";

import { useHasPerm } from "../contexts/authz-provider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { EditLoanOfferForm } from "./edit-loan-offer-form";
import { loanOfferTableColumns } from "./loan-offer-table-columns";
import { LoanOfferDTO } from "./loan-offer.schema";

export function LoanOfferList() {
  const [offers, setOffers] = useState<LoanOfferDTO[]>([]);
  const [editing, setEditing] = useState<LoanOfferDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const canEdit = useHasPerm(Perm.LOAN_UPDATE);

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

        const data = (await response.json()) as LoanOfferDTO[];
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
        meta={{ setEditing, canEdit }}
      />

      {canEdit && (
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
      )}
    </>
  );
}
