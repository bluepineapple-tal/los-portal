"use client";

import { CreateLoanOfferForm } from "@/components/loan-offers/create-loan-offer-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CreateLoanOffer() {
  return (
    <div className="space-y-6">
      <div className="max-w-(--breakpoint-md) mx-auto flex gap-4">
        <Card
          className={cn(
            "w-full h-32 flex justify-center items-center transition-all bg-primary text-primary-foreground",
          )}
          // onClick={() => setSelectedTab("create-loan")}
        >
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Create Loan Offer
          </h2>
        </Card>
      </div>

      {/* Loan Form */}
      <Card className="max-w-(--breakpoint-md) mx-auto">
        <CardHeader>
          <CardTitle>Add Loan Details</CardTitle>
          <CardDescription>
            Select a product and create a loan offer for this product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateLoanOfferForm />
        </CardContent>
      </Card>
    </div>
  );
}
