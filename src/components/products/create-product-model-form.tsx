"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createProductModelSchema } from "./create-product-model.schema";
import { ProductStatus } from "./product.interface";

export function CreateProductModelForm() {
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
  function onSubmit(values: z.infer<typeof createProductModelSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Make ID */}
        <FormField
          control={form.control}
          name="makeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., UUID of the Make" {...field} />
              </FormControl>
              <FormDescription>
                Provide the make&apos;s unique identifier to associate the
                product.
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
