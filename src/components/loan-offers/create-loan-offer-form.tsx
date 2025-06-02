"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createLoanOfferSchema } from "@/components/loan-offers/create-loan-offer.schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { useToast } from "@/hooks/use-toast";
import { createLoanOffer } from "@/lib/functions/loan-offers.api";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CreateLoanOfferForm() {
  // Loading/error states for each fetch call
  const { toast } = useToast();

  // Define the form
  const form = useForm<z.infer<typeof createLoanOfferSchema>>({
    resolver: zodResolver(createLoanOfferSchema),
    defaultValues: {
      offer_name: "",
      interest_rate: 0,
      tenure_months: 12,
      valid_from: new Date(),
      valid_to: new Date(),
      min_amount: 10000,
      max_amount: 50000,
      processing_fee: 0,
      offer_details: "",
      is_active: false,
    },
  });

  // Define a submit handler
  const onSubmit = async (values: z.infer<typeof createLoanOfferSchema>) => {
    // This will be type-safe & validated by Zod
    try {
      const newLoanOffer = await createLoanOffer(values);
      toast({
        style: { backgroundColor: "#4ade80" },
        title: "Loan Offer created successfully",
        description: newLoanOffer.offer_name,
      });
    } catch (error) {
      console.error("error: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Error creating Loan Offer.",
        description: error instanceof Error ? error.message : (error as string),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* OFFER NAME */}
        <FormField
          control={form.control}
          name="offer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Name *</FormLabel>
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
              <FormLabel>Interest Rate (%) *</FormLabel>
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
        <div className="flex gap-4">
          {/* MINIMUM LOAN AMOUNT */}
          <FormField
            control={form.control}
            name="min_amount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Minimum Loan Amount *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 10000"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Minimum amount on which this loan offer is applicable
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MAXIMUM LOAN AMOUNT */}
          <FormField
            control={form.control}
            name="max_amount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Maximum Loan Amount *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 50000"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Maximum amount on which this loan offer is applicable
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          {/* VALID FROM DATE */}
          <FormField
            control={form.control}
            name="valid_from"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Offer Valid From *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date("2100-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Offer will be valid from this date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VALID TO DATE */}
          <FormField
            control={form.control}
            name="valid_to"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Offer Valid Till *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        // FIXME: Change disable date loging to make it in the future of valid from date. Remove the error from form schema
                        date < new Date() || date > new Date("2100-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Offer will expire on this date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* PROCESSING FEE */}
        <FormField
          control={form.control}
          name="processing_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processing Fee *</FormLabel>
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
