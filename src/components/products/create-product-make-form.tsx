"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProductMakeSchema } from "@/components/products/create-product-make.schema";
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
import { createProductMake } from "@/lib/functions/product-make.api";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ProductStatus } from "./product.interface";

export function CreateProductMakeForm() {
  const { toast } = useToast();

  // Define the form.
  const form = useForm<z.infer<typeof createProductMakeSchema>>({
    resolver: zodResolver(createProductMakeSchema),
    defaultValues: {
      name: "",
      description: "",
      status: ProductStatus.INACTIVE,
    },
  });

  async function onSubmit(values: z.infer<typeof createProductMakeSchema>) {
    // ✅ This will be type-safe and validated.
    try {
      const newMake = await createProductMake(values);
      toast({
        style: { backgroundColor: "#4ade80" },
        title: "Product Make created successfully",
        description: newMake.name,
      });
      // Optionally, navigate somewhere or show a success message
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Error creating product make.",
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
              <FormLabel>Make Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Apple" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your product make.
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
              <FormLabel>Make Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., High-end smartphone company"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of your product make.
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
                  defaultValue={ProductStatus.ACTIVE}
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
                Select the current status of the product make.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Product Make</Button>
      </form>
    </Form>
  );
}
