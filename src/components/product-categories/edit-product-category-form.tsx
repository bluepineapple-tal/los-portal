"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE_URL } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ProductCategoryDTO,
  productCategorySchema,
  productCategoryStatusEnum,
} from "./product-category.schema";
import { fetchApi } from "@/lib/fetch-api";

type Props = {
  category: ProductCategoryDTO;
  onSuccess(updated: ProductCategoryDTO): void;
  onCancel(): void;
};

export function EditProductCategoryForm({
  category,
  onSuccess,
  onCancel,
}: Readonly<Props>) {
  const form = useForm<
    Pick<ProductCategoryDTO, "name" | "description" | "status">
  >({
    resolver: zodResolver(
      productCategorySchema.pick({
        name: true,
        description: true,
        status: true,
      }),
    ),
    defaultValues: {
      name: category.name,
      description: category.description ?? "",
      status: category.status,
    },
  });

  async function submit(
    values: Pick<ProductCategoryDTO, "name" | "description" | "status">,
  ) {
    const updated = await fetchApi<ProductCategoryDTO>(
      `${API_BASE_URL}/product-categories/${category.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );
    onSuccess(updated);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategoryStatusEnum.options.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
