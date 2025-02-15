import { CreateProductForm } from "@/components/products/create-product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div>
      <Card className="max-w-screen-md mx-auto">
        <CardHeader>
          <CardTitle>Create product</CardTitle>
          <CardDescription>
            Create a new product to add it to the LOS products list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
