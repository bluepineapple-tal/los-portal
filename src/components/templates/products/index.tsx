"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { DataTable } from "@/components/ui/data-table";

import { IProductMake } from "@/components/products/product.interface";
import { API_BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { productMakeTableColumns } from "@/components/products/product-make-table-columns";

export const ProductPageTemplate = () => {
  const session = useSessionContext();

  // State for all possible Makes (fetched from backend)
  const [makes, setMakes] = useState<IProductMake[]>([]);
  // State for all possible Models for the selected Make
  // const [models, setModels] = useState<IProductModel[]>([]);

  // Loading/error states for each fetch call
  const [loadingMakes, setLoadingMakes] = useState(true);
  // const [loadingModels, setLoadingModels] = useState(false);
  // TODO: remove below comment later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMakes, setErrorMakes] = useState<string | null>(null);
  // const [errorModels, setErrorModels] = useState<string | null>(null);

  // 1) Fetch all Makes on component mount
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
      <h1>Product Makes</h1>
      {/* TODO: Add a proper skeleton for table */}
      {loadingMakes ? (
        <p>Loading makes...</p>
      ) : (
        <DataTable columns={productMakeTableColumns} data={makes} />
      )}
    </div>
  );
};
