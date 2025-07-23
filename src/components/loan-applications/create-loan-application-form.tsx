"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  createLoanApplicationSchema,
  ICreateLoanApplication,
} from "@/components/loan-applications/create-loan-application.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL, URLS } from "@/lib/constants";
import { fetchApi } from "@/lib/fetch-api";
import { createLoanApplication } from "@/lib/functions/loan-applications.api";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoanOfferDTO } from "../loan-offers/loan-offer.schema";
import { UserDTO } from "../onboarding/user.schema";
import { ProductCategoryDTO } from "../product-categories/product-category.schema";
import { DisplayField } from "../ui/display-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CreateLoanApplicationForm({
  userId,
  offers,
  categories,
}: Readonly<{
  userId: string;
  offers: LoanOfferDTO[];
  categories: ProductCategoryDTO[];
}>) {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<UserDTO>();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchApi<UserDTO>(
        `${API_BASE_URL}/users/st/${userId}`,
      );
      setUser(response);
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  /* ---------------------------- form setup ---------------------------- */
  const form = useForm<ICreateLoanApplication>({
    resolver: zodResolver(createLoanApplicationSchema),
    defaultValues: {
      monthly_income: 0,
      requested_amount: 0,
      consent: true,
    },
  });

  const requestedAmount = form.watch("requested_amount") ?? 0;

  /** Only keep offers that:
   *  1. are active,
   *  2. match the requested_amount, and
   *  3. are currently within their valid_from / valid_to window.
   */
  const validOffers = useMemo(() => {
    const today = new Date();

    return offers.filter((o) => {
      if (!o.is_active) return false;

      // -- amount within [min, max] --------------------------------------
      const amt = requestedAmount;
      const min = Number(o.min_amount);
      const max = Number(o.max_amount);
      if (amt < min || amt > max) return false;

      // -- date within [valid_from, valid_to] ----------------------------
      const from = new Date(o.valid_from); // works for ISO strings
      const to = new Date(o.valid_to);
      return today >= from && today <= to;
    });
  }, [offers, requestedAmount]);

  /* submit -------------------------------------------------------- */
  const onSubmit = async (values: ICreateLoanApplication) => {
    if (!user?.consumerProfile?.id) {
      toast({ variant: "destructive", title: "No consumer profile found" });
      return;
    }

    const response = await createLoanApplication({
      consumerId: user.consumerProfile.id,
      application_date: new Date(),
      status: "submitted",
      ...values,
    });

    toast({
      style: { backgroundColor: "#4ade80" },
      title: "Application submitted",
    });

    router.replace(`${URLS.LOAN_APPLICATIONS}/${response.id}`);
  };

  if (!user?.consumerProfile) return null;

  const cp = user.consumerProfile; // shorthand

  /* ------------------------------ UI --------------------------------- */
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* -------- PERSONAL & CONTACT ----------------------------------- */}
        <fieldset disabled className="border rounded p-4 space-y-4">
          <legend className="text-sm font-medium">Personal details</legend>

          <div className="grid gap-4 md:grid-cols-2">
            <DisplayField label="First name" value={user.first_name} />
            <DisplayField label="Last name" value={user.last_name} />
          </div>
          <DisplayField label="Email" value={user.email} />
          <div className="grid gap-4 md:grid-cols-2">
            <DisplayField label="Phone" value={user.phone} />
            <DisplayField
              label="Date of birth"
              value={format(new Date(cp.date_of_birth), "PPP")}
            />
            <DisplayField label="Gender" value={cp.gender} />
            <DisplayField label="Marital status" value={cp.marital_status} />
          </div>
        </fieldset>

        {/* -------- ADDRESS --------------------------------------------- */}
        <fieldset disabled className="border rounded p-4 space-y-4">
          <legend className="text-sm font-medium">Address</legend>

          <DisplayField label="Street 1" value={cp.street1} />
          <DisplayField label="Street 2" value={cp.street2} />
          <div className="grid gap-4 md:grid-cols-3">
            <DisplayField label="City" value={cp.city} />
            <DisplayField label="State" value={cp.state} />
            <DisplayField label="PIN code" value={cp.pin_code} />
          </div>
          <DisplayField label="Country" value={cp.country} />
        </fieldset>

        {/* -------- KYC & INCOME ---------------------------------------- */}
        <fieldset disabled className="border rounded p-4 space-y-4">
          <legend className="text-sm font-medium">KYC & Income</legend>

          <DisplayField label="Aadhaar" value={cp.aadhar_number} />
          <DisplayField label="PAN" value={cp.pan_number} />
        </fieldset>

        {/* monthly income ----------------------------------------- */}
        <FormField
          control={form.control}
          name="monthly_income"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Income *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={1000}
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

        {/* source of income ----------------------------------------- */}
        <FormField
          control={form.control}
          name="source_of_income"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source of Income *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a source of income" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaried">Salaried</SelectItem>
                  <SelectItem value="self_employed">Self Employed</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* product category ----------------------------------------- */}
        <FormField
          control={form.control}
          name="productCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product category *</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* amount ---------------------------------------------------- */}
        <FormField
          control={form.control}
          name="requested_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested amount *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1000}
                  step={1}
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value, 10) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* loan offer ----------------------------------------------- */}
        <FormField
          control={form.control}
          name="loanOfferId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan offer *</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={requestedAmount <= 0}
                >
                  <SelectTrigger>
                    {field.value && requestedAmount > 0 ? (
                      <>
                        <div className="text-sm font-medium">
                          {offers.find((o) => o.id === field.value)?.offer_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {offers
                            .filter((o) => o.id === field.value)
                            .map(
                              (o) =>
                                `${o.interest_rate}% · ₹${Number(o.min_amount).toLocaleString()}–₹${Number(
                                  o.max_amount,
                                ).toLocaleString()} · ${o.tenure_months}m`,
                            )}
                        </div>
                      </>
                    ) : (
                      <SelectValue placeholder="Select an offer" />
                    )}
                  </SelectTrigger>

                  <SelectContent className="w-[28rem]">
                    {validOffers.length > 0 ? (
                      validOffers.map((o) => (
                        <SelectItem key={o.id} value={o.id} className="py-3">
                          <div className="text-sm font-medium">
                            {o.offer_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {o.interest_rate}% &bull; ₹
                            {Number(o.min_amount).toLocaleString()}–₹
                            {Number(o.max_amount).toLocaleString()} &bull;{" "}
                            {o.tenure_months}m
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-offer">
                        No offers for amount ₹{requestedAmount.toLocaleString()}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="mt-1"
                />
              </FormControl>
              <FormLabel
                htmlFor="consentCheckbox"
                className="text-sm font-normal"
              >
                I hereby authorize the lender to conduct Know Your Customer
                (KYC) and Anti-Money Laundering (AML) checks, and to obtain my
                credit report and credit score from authorized credit bureaus as
                part of the loan application process.
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ------------------------- SUBMIT ------------------------------ */}
        <Button
          type="submit"
          className="mt-6"
          disabled={!form.watch("consent")}
        >
          Submit Application
        </Button>
      </form>
    </Form>
  );
}
