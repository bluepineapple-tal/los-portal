"use client";
import { useState } from "react";

import { CreateProductMakeForm } from "@/components/products/create-product-make-form";
import { CreateProductModelForm } from "@/components/products/create-product-model-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Page() {
  const [showProduct, setShowProduct] = useState<"make" | "model">("make");

  return (
    <div className="space-y-6">
      <div className="max-w-(--breakpoint-md) mx-auto flex gap-4">
        {/* Form Triggers */}
        <Card
          className={cn(
            "w-full h-32 cursor-pointer flex justify-center items-center transition-all",
            showProduct === "make"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary hover:text-secondary-foreground",
          )}
          onClick={() => setShowProduct("make")}
        >
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Create a Product Make
          </h2>
        </Card>
        <Card
          className={cn(
            "w-full h-32 cursor-pointer flex justify-center items-center transition-all",
            showProduct === "model"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary hover:text-secondary-foreground",
          )}
          onClick={() => setShowProduct("model")}
        >
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Create a Product Model
          </h2>
        </Card>
      </div>
      {/* Forms */}
      {showProduct === "make" && (
        <Card className="max-w-(--breakpoint-md) mx-auto">
          <CardHeader>
            <CardTitle>Add new Product Make details</CardTitle>
            <CardDescription>
              Create a new product to add it to the LOS products list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateProductMakeForm />
          </CardContent>
        </Card>
      )}
      {showProduct === "model" && (
        <Card className="max-w-(--breakpoint-md) mx-auto">
          <CardHeader>
            <CardTitle>Add new Product Model details</CardTitle>
            <CardDescription>
              Create a new product to add it to the LOS products list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateProductModelForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
