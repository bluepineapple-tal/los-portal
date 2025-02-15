import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "../ui/badge";

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
}

export function ProductsTable({
  products,
}: Readonly<{
  products: IProduct[];
}>) {
  const getBadgeVariant = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return "success";
      case ProductStatus.DISCONTINUED:
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Table>
      <TableCaption>A list of available products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Product Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products?.length > 0 ? (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell className="text-right">
                ${product.price.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(product.status)}>
                  {product.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No products available
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total Products</TableCell>
          <TableCell colSpan={2} className="text-right">
            {products?.length ?? "NA"}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
