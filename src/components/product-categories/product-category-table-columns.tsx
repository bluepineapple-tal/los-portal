import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ProductCategoryDTO } from "./product-category.schema";

export const productCategoryTableColumns: ColumnDef<ProductCategoryDTO>[] = [
  /* name (linked) ------------------------------------------------- */
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <a
        href={`/product-categories/${row.original.id}`}
        className="hover:text-blue-500"
      >
        {row.original.name}
      </a>
    ),
  },

  /* description -------------------------------------------------- */
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description ?? "—",
  },

  /* status badge -------------------------------------------------- */
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "active"
          ? "success"
          : status === "inactive"
            ? "secondary"
            : "destructive";

      return (
        <Badge variant={variant} className="w-full justify-center">
          {status.toLowerCase()}
        </Badge>
      );
    },
  },

  /* action column ------------------------------------------------- */
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const offer = row.original;
      // grab setter we passed via meta
      // @ts-expect-error meta
      const setEditing = table.options.meta?.setEditing;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(offer.id)}
            >
              Copy ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setEditing?.(offer)}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
