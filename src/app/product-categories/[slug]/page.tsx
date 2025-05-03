import { IProductCategory } from "@/components/product-categories/product-category.interface";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/constants";

export default async function ProductCategoryPage({
  params,
}: Readonly<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}>) {
  const { slug } = params;
  const productcategoryResponse = await fetch(
    `${API_BASE_URL}/product-category/slug/${slug}`,
  );

  if (!productcategoryResponse.ok) {
    console.error(
      `Failed to fetch category: ${productcategoryResponse.statusText}`,
    );
    return <h1>Failed to fetch make</h1>;
  }

  const productcategory =
    (await productcategoryResponse.json()) as IProductCategory;

  return (
    <div>
      <Card className="max-w-screen-xl w-full mx-auto flex justify-center items-center bg-primary text-primary-foreground text-center">
        <CardHeader>
          <CardTitle>
            <h1>{productcategory.name}</h1>
          </CardTitle>
          <CardDescription>{productcategory.description}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
