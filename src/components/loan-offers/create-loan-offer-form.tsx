"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { createLoanOfferSchema } from "@/app/loan-offers/create/createLoanOfferFormSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreateLoanOfferForm() {
  // Define the form
  const form = useForm<z.infer<typeof createLoanOfferSchema>>({
    resolver: zodResolver(createLoanOfferSchema),
    defaultValues: {
      productId: "",
      offer_name: "",
      interest_rate: 0,
      tenure_months: 12,
      processing_fee: 0,
      offer_details: "",
      is_active: true,
    },
  });

  // Define a submit handler
  const onSubmit = (values: z.infer<typeof createLoanOfferSchema>) => {
    // This will be type-safe & validated by Zod
    console.log("Loan Offer Form Submitted:", values);
    // TODO: Make an API request to create the Loan Offer in your BE
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* PRODUCT ID */}
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input placeholder="UUID of the product" {...field} />
              </FormControl>
              <FormDescription>
                The UUID of the product for which you are creating this loan
                offer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OFFER NAME */}
        <FormField
          control={form.control}
          name="offer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Special New Year Offer" {...field} />
              </FormControl>
              <FormDescription>Name/title of the loan offer.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* INTEREST RATE */}
        <FormField
          control={form.control}
          name="interest_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interest Rate (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 7.50"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                The annual interest rate (e.g., 7.5 for 7.5%).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TENURE MONTHS */}
        <FormField
          control={form.control}
          name="tenure_months"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenure (Months)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  placeholder="e.g., 12"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                How many months this loan will last.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PROCESSING FEE */}
        <FormField
          control={form.control}
          name="processing_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processing Fee</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 999.99"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                Fee charged to process the loan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OFFER DETAILS */}
        <FormField
          control={form.control}
          name="offer_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Details</FormLabel>
              <FormControl>
                <Input
                  placeholder="Optional info about this offer..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Additional details or constraints.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IS ACTIVE */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3">
              <FormLabel>Is Active?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Loan Offer</Button>
      </form>
    </Form>
  );
}
