"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProductSchema } from "@/app/products/create/createProductFormSchema";
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
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ProductStatus } from "./columns";

export function CreateProductForm() {
  // 1. Define the form.
  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      status: ProductStatus.INACTIVE,
      vendorId: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createProductSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., iPhone 15 Pro" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your product.
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
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., High-end smartphone with A17 chip"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of your product.
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
                Enter the product price (in INR).
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
                Select the current status of the product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vendor ID */}
        <FormField
          control={form.control}
          name="vendorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., UUID of the vendor" {...field} />
              </FormControl>
              <FormDescription>
                Provide the vendor&apos;s unique identifier.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
