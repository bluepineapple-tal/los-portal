import { productTableColumns } from "@/components/products/columns";
import { DataTable } from "@/components/ui/data-table";

import productsMock from "./__mocks___/products.mock";

export default function Page() {
  return (
    <div>
      <h1>Products</h1>
      <DataTable columns={productTableColumns} data={productsMock} />
    </div>
  );
}
