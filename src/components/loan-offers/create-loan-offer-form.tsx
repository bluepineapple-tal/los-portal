"use client";

import { useCallback, useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/constants";
import { createLoanOffer } from "@/lib/functions/loan-offers.api";
import { zodResolver } from "@hookform/resolvers/zod";

import { IProductMake, IProductModel } from "../products/product.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CreateLoanOfferForm() {
  // State for all possible Makes (fetched from backend)
  const [makes, setMakes] = useState<IProductMake[]>([]);
  // State for all possible Models for the selected Make
  const [models, setModels] = useState<IProductModel[]>([]);

  // Loading/error states for each fetch call
  const [loadingMakes, setLoadingMakes] = useState(true);
  console.log("loadingMakes: ", loadingMakes);
  const [loadingModels, setLoadingModels] = useState(false);
  console.log("loadingModels: ", loadingModels);

  const { toast } = useToast();

  // 1) Fetch all Makes on component mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoadingMakes(true);
        const response = await fetch(`${API_BASE_URL}/product-make`);
        if (!response.ok) {
          throw new Error(`Failed to fetch makes: ${response.statusText}`);
        }
        const data = (await response.json()) as IProductMake[];
        setMakes(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: error instanceof Error ? error.message : "Error",
        });
      } finally {
        setLoadingMakes(false);
      }
    };

    fetchMakes();
  }, [toast]);

  // 2) When the user selects a Make, fetch the Models for that Make
  const handleMakeChange = useCallback(
    async (newMakeId: string) => {
      setModels([]); // clear old models

      if (!newMakeId) return;

      try {
        setLoadingModels(true);
        const response = await fetch(
          `${API_BASE_URL}/product-model/make/${newMakeId}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
        const data = (await response.json()) as IProductModel[];
        setModels(data);
      } catch (error) {
        toast({
          style: { backgroundColor: "red" },
          title: error instanceof Error ? error.message : "Error",
        });
      } finally {
        setLoadingModels(false);
      }
    },
    [toast],
  );

  // Define the form
  const form = useForm<z.infer<typeof createLoanOfferSchema>>({
    resolver: zodResolver(createLoanOfferSchema),
    defaultValues: {
      productMakeId: "",
      productModelId: "",
      offer_name: "",
      interest_rate: 0,
      tenure_months: 12,
      processing_fee: 0,
      offer_details: "",
      is_active: true,
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
      console.log("error: ", error);
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
        {/* Product Make Dropdown */}
        <FormField
          control={form.control}
          name="productMakeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Make</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    if (value !== field.value) {
                      handleMakeChange(value);
                      field.onChange(value);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product make" />
                  </SelectTrigger>
                  <SelectContent>
                    {makes.map((make) => (
                      <SelectItem key={make.id} value={make.id}>
                        {make.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Select the product make.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Model Dropdown */}
        <FormField
          control={form.control}
          name="productModelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Model</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the product model for this model.
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
