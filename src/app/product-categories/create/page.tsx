"use client";

import { CreateProductCategoryForm } from "@/components/product-categories/create-product-category-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProductCategoryCreatePage() {
  return (
    <div className="space-y-6">
      <Card className="max-w-screen-md mx-auto">
        <CardHeader>
          <CardTitle>Add new Product Category</CardTitle>
          <CardDescription>
            Define and manage product categories in the LOS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductCategoryForm />
        </CardContent>
      </Card>
    </div>
  );
}
