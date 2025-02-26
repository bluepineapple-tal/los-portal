"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { productTableColumns } from "@/components/products/columns";
import { DataTable } from "@/components/ui/data-table";

import productsMock from "./__mocks___/products.mock";

export const ProductPageTemplate = () => {
  const session = useSessionContext();

  if (session.loading) {
    return <div>Loading...</div>;
  }

  if (session.doesSessionExist === false) {
    return <div>Session does not exist</div>;
  }
  console.log(`Client side component got userId: ${session.userId}`);
  return (
    <div>
      <h1>Products</h1>
      <DataTable columns={productTableColumns} data={productsMock} />
    </div>
  );
};
