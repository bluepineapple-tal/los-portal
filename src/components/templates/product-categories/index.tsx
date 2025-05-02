"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import AlertDestructive from "@/components/common/alerts/alert-destructive";
import { productCategoryTableColumns as productCategoryTableColumns } from "@/components/product-categories/product-category-table-columns";
import { IProductCategory as IProductCategory } from "@/components/product-categories/product-category.interface";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { API_BASE_URL } from "@/lib/constants";

export const ProductCategoryPageTemplate = () => {
  const session = useSessionContext();

  const [productCategories, setProductCategories] = useState<
    IProductCategory[]
  >([]);

  const [loadingProductCategories, setLoadingProductCategories] =
    useState(true);
  const [errorProductCategories, setErrorProductCategories] = useState<
    string | null
  >(null);

  // Fetch all ProductCategories on component mount
  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        setLoadingProductCategories(true);
        const response = await fetch(`${API_BASE_URL}/product-category`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch productCategories: ${response.statusText}`,
          );
        }
        const data = (await response.json()) as IProductCategory[];
        setProductCategories(data);
      } catch (error) {
        setErrorProductCategories(
          error instanceof Error ? error.message : "Unknown error",
        );
      } finally {
        setLoadingProductCategories(false);
      }
    };

    fetchProductCategories();
  }, []);

  if (session.loading) {
    return <div>Loading...</div>;
  }

  if (session.doesSessionExist === false) {
    return <div>Session does not exist</div>;
  }

  return (
    <div>
      <Card className="max-w-screen-xl w-full mx-auto flex justify-center items-center bg-primary text-primary-foreground text-center">
        <CardHeader>
          <CardTitle>
            <h1>Product Categories</h1>
          </CardTitle>
        </CardHeader>
      </Card>

      {errorProductCategories && (
        <AlertDestructive title="Error" description={errorProductCategories} />
      )}
      {/* TODO: Add a proper skeleton for table */}
      {loadingProductCategories ? (
        <p>Loading productCategories...</p>
      ) : (
        <DataTable
          columns={productCategoryTableColumns}
          data={productCategories}
          filterColumnId="description"
        />
      )}
    </div>
  );
};
