import { NextPage } from "next";

import { productModelTableColumns } from "@/components/products/product-model-table.columns";
import {
  IProductMake,
  IProductModel,
} from "@/components/products/product.interface";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { API_BASE_URL } from "@/lib/constants";

const ProductMakePage: NextPage<{ params: { slug: string } }> = async ({
  params: { slug },
}) => {
  const makeResponse = await fetch(`${API_BASE_URL}/product-make/slug/${slug}`);

  if (!makeResponse.ok) {
    console.error(`Failed to fetch make: ${makeResponse.statusText}`);
    return <h1>Failed to fetch make</h1>;
  }

  const make = (await makeResponse.json()) as IProductMake;

  const modelsResponse = await fetch(
    `${API_BASE_URL}/product-model/make/slug/${make.slug}`,
  );

  if (!modelsResponse.ok) {
    console.error(`Failed to fetch models: ${modelsResponse.statusText}`);
    return <h1>Failed to fetch models</h1>;
  }

  const models = (await modelsResponse.json()) as IProductModel[];

  return (
    <div>
      <Card className="max-w-screen-xl w-full mx-auto flex justify-center items-center bg-primary text-primary-foreground text-center">
        <CardHeader>
          <CardTitle>
            <h1>{make.name}</h1>
          </CardTitle>
          <CardDescription>{make.description}</CardDescription>
        </CardHeader>
      </Card>

      <DataTable columns={productModelTableColumns} data={models} />
    </div>
  );
};

export default ProductMakePage;
