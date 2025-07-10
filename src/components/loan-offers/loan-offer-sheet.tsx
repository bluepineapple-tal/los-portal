"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import { LoanOfferDTO } from "./loan-offer.schema";

export function LoanOfferSheet({ offer }: Readonly<{ offer: LoanOfferDTO }>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="px-0 text-left">
          {offer.offer_name}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col gap-6">
        <SheetHeader>{offer.offer_name}</SheetHeader>

        <div className="grid gap-2 text-sm">
          <p>
            <strong>Interest&nbsp;Rate:</strong>{" "}
            {parseFloat(offer.interest_rate).toFixed(2)}%
          </p>
          <p>
            <strong>Tenure:</strong> {offer.tenure_months} months
          </p>
          <p>
            <strong>Processing Fee:</strong> ₹{offer.processing_fee}
          </p>
          {offer.offer_details && <p>{offer.offer_details}</p>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
