"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import AlertDestructive from "@/components/common/alerts/alert-destructive";
import { productMakeTableColumns } from "@/components/products/product-make-table-columns";
import { IProductMake } from "@/components/products/product.interface";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { API_BASE_URL } from "@/lib/constants";

export const ProductPageTemplate = () => {
  const session = useSessionContext();

  const [makes, setMakes] = useState<IProductMake[]>([]);

  const [loadingMakes, setLoadingMakes] = useState(true);
  const [errorMakes, setErrorMakes] = useState<string | null>(null);

  // Fetch all Makes on component mount
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
        setErrorMakes(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoadingMakes(false);
      }
    };

    fetchMakes();
  }, []);

  if (session.loading) {
    return <div>Loading...</div>;
  }

  if (session.doesSessionExist === false) {
    return <div>Session does not exist</div>;
  }
  console.log(`Client side component got userId: ${session.userId}`);
  return (
    <div>
      <Card className="max-w-screen-xl w-full mx-auto flex justify-center items-center bg-primary text-primary-foreground text-center">
        <CardHeader>
          <CardTitle>
            <h1>Product Makes</h1>
          </CardTitle>
        </CardHeader>
      </Card>

      {errorMakes && (
        <AlertDestructive title="Error" description={errorMakes} />
      )}
      {/* TODO: Add a proper skeleton for table */}
      {loadingMakes ? (
        <p>Loading makes...</p>
      ) : (
        <DataTable columns={productMakeTableColumns} data={makes} />
      )}
    </div>
  );
};
