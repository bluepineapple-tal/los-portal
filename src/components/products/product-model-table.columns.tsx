"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { deleteProductModel } from "@/lib/functions/product-model.api";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../ui/badge";
import { DataTableColumnHeader } from "../ui/data-table-column-header";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IProductModel, ProductStatus } from "./product.interface";

export const productModelTableColumns: ColumnDef<IProductModel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
    cell: ({ row }) => {
      const productModel = row.original;
      return (
        <Link
          href={`/products/${productModel.make?.slug}/${productModel.slug}`}
          className="hover:text-blue-500"
        >
          {productModel.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      let variant:
        | "success"
        | "destructive"
        | "default"
        | "secondary"
        | "outline"
        | null
        | undefined;
      const status: ProductStatus = row.getValue("status");
      switch (status) {
        case ProductStatus.ACTIVE:
          variant = "success";
          break;
        case ProductStatus.DISCONTINUED:
          variant = "destructive";
          break;
        default:
          variant = "default";
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const productModel = row.original;

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(productModel.id)}
              >
                Copy product model ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/products/${productModel.slug}`}>
                  View model details
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Button variant={"destructive"} className="flex-1">
                    Delete
                  </Button>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                <span className="text-destructive">
                  This action cannot be undone. This will permanently delete{" "}
                  <strong>{productModel.name}.</strong>
                </span>
              </DialogDescription>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    variant={"destructive"}
                    className="flex-1"
                    onClick={async () => {
                      const success = await deleteProductModel(productModel.id);
                      if (success) {
                        toast({
                          title: `Successfully deleted ${productModel.name}`,
                        });
                      }
                    }}
                  >
                    Delete {productModel.name}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
