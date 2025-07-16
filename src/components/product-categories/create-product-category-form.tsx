"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProductCategorySchema } from "@/components/product-categories/create-product-category.schema";
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
import { createProductCategory } from "@/lib/functions/product-category.api";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { productCategoryStatusEnum } from "./product-category.schema";

export function CreateProductCategoryForm() {
  const { toast } = useToast();

  // Define the form.
  const form = useForm<z.infer<typeof createProductCategorySchema>>({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  async function onSubmit(values: z.infer<typeof createProductCategorySchema>) {
    // ✅ This will be type-safe and validated.

    try {
      const newCat = await createProductCategory(values);
      toast({
        style: { backgroundColor: "#4ade80" },
        title: "Product Category created successfully",
        description: newCat.name,
      });
      // Optionally, navigate somewhere or show a success message
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Error creating product category.",
        description: error instanceof Error ? error.message : (error as string),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Home Appliances" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the product category.
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
              <FormLabel>Product Category Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., About Home Appliances" {...field} />
              </FormControl>
              <FormDescription>
                Provide a brief description of your product category.
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
                  defaultValue={productCategoryStatusEnum.options[0]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product category status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(productCategoryStatusEnum.options).map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the current status of the product category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Product Category</Button>
      </form>
    </Form>
  );
}
