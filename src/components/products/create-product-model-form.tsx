"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/constants";
import { createProductModel } from "@/lib/functions/product-model.api";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createProductModelSchema } from "./create-product-model.schema";
import { IProductMake, ProductStatus } from "./product.interface";
import { fetchApi } from "@/lib/fetch-api";

export function CreateProductModelForm() {
  const [makes, setMakes] = useState<IProductMake[]>([]);
  const { toast } = useToast();

  // Fetch the available product makes on component mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        const data = await fetchApi<IProductMake[]>(
          `${API_BASE_URL}/product-make`,
        );
        setMakes(data);
      } catch (error) {
        console.error("Error fetching product makes:", error);
      }
    }
    fetchMakes();
  }, []);

  // Define the form.
  const form = useForm<z.infer<typeof createProductModelSchema>>({
    resolver: zodResolver(createProductModelSchema),
    defaultValues: {
      makeId: "",
      name: "",
      description: "",
      price: 0,
      status: ProductStatus.INACTIVE,
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof createProductModelSchema>) {
    // ✅ This will be type-safe and validated.
    try {
      const newModel = await createProductModel(values);
      toast({
        style: { backgroundColor: "#4ade80" },
        title: "Product Model created successfully",
        description: newModel.name,
      });
    } catch (error) {
      console.error("error: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Error creating product model.",
        description: error instanceof Error ? error.message : (error as string),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Make Dropdown */}
        <FormField
          control={form.control}
          name="makeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Make</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
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
              <FormDescription>
                Select the product make for this model.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., iPhone 15 Pro" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your product model.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., High-end smartphone with A17 chip"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of your product model.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 120000"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                Enter the product model price (in INR).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Dropdown */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProductStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the current status of the product model.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Product Model</Button>
      </form>
    </Form>
  );
}
