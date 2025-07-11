"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createLoanOfferSchema,
  ICreateLoanOffer,
} from "@/components/loan-offers/create-loan-offer.schema";
import { LoanOfferDTO } from "@/components/loan-offers/loan-offer.schema";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { updateLoanOffer } from "@/lib/functions/loan-offers.api";
import { useToast } from "@/hooks/use-toast";

interface EditLoanOfferFormProps {
  offer: LoanOfferDTO;
  /** Tell parent we’re done so it can close the Sheet & refresh the row. */
  onSuccess(updated: LoanOfferDTO): void;
  /** Optional: close without saving. */
  onCancel?(): void;
}

export function EditLoanOfferForm({
  offer,
  onSuccess,
  onCancel,
}: Readonly<EditLoanOfferFormProps>) {
  const { toast } = useToast();

  /* ---------------------------- RHF setup ----------------------------- */
  const form = useForm<ICreateLoanOffer>({
    resolver: zodResolver(createLoanOfferSchema),
    defaultValues: {
      ...offer,
      min_amount: Number(offer.min_amount),
      max_amount: Number(offer.max_amount),
      tenure_months: Number(offer.tenure_months),
      interest_rate: Number(offer.interest_rate),
      processing_fee: Number(offer.processing_fee),
      valid_from: new Date(offer.valid_from),
      valid_to: new Date(offer.valid_to),
    },
  });

  /* Ensure form re-initialises when a DIFFERENT offer is selected          */
  useEffect(() => {
    form.reset({
      ...offer,
      min_amount: Number(offer.min_amount),
      max_amount: Number(offer.max_amount),
      tenure_months: Number(offer.tenure_months),
      interest_rate: Number(offer.interest_rate),
      processing_fee: Number(offer.processing_fee),
      valid_from: new Date(offer.valid_from),
      valid_to: new Date(offer.valid_to),
    });
  }, [offer, form]);

  const onSubmit = async (values: ICreateLoanOffer) => {
    try {
      const updated = await updateLoanOffer(offer.id, values);
      toast({
        style: { backgroundColor: "#4ade80" },
        title: "Loan Offer updated",
        description: updated.offer_name,
      });
      onSuccess(updated);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-8rem)] pr-2"
      >
        {/* ---------- OFFER NAME ---------- */}
        <FormField
          control={form.control}
          name="offer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Special New Year Offer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- INTEREST RATE ---------- */}
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
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- TENURE ---------- */}
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
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- AMOUNT RANGE ---------- */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="min_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Amount *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Amount *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ---------- VALID FROM / TO ---------- */}
        <div className="grid grid-cols-2 gap-4">
          {(["valid_from", "valid_to"] as const).map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {fieldName === "valid_from" ? "Valid From" : "Valid To"} *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
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
                          date < new Date("2000-01-01") ||
                          date > new Date("2100-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* ---------- PROCESSING FEE ---------- */}
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
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- DETAILS ---------- */}
        <FormField
          control={form.control}
          name="offer_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Details</FormLabel>
              <FormControl>
                <Input placeholder="Optional notes…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- IS ACTIVE ---------- */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormLabel>Is Active?</FormLabel>
              <FormControl>
                {/* reuse your Switch component if you prefer  */}
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------- ACTIONS ---------- */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
