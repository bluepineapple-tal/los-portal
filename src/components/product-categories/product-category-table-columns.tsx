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
import { useToast } from "@/hooks/use-toast";
import { deleteProductCategory } from "@/lib/functions/product-category.api";
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
import {
  IProductCategory,
  ProductCategoryStatus,
} from "./product-category.interface";

export const productCategoryTableColumns: ColumnDef<IProductCategory>[] = [
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
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const productCategory = row.original;
      return (
        <Link
          href={`/product-categories/${productCategory.slug}`}
          className="hover:text-blue-500"
        >
          {productCategory.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
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
      const status: ProductCategoryStatus = row.getValue("status");
      switch (status) {
        case ProductCategoryStatus.ACTIVE:
          variant = "success";
          break;
        case ProductCategoryStatus.DISCONTINUED:
          variant = "destructive";
          break;
        default:
          variant = "default";
      }

      return (
        <Badge variant={variant} className="w-full justify-center">
          {status}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast();
      const productCategory = row.original;

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
                onClick={() =>
                  navigator.clipboard.writeText(productCategory.id)
                }
              >
                Copy product category ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/product-categories/${productCategory.slug}`}>
                  View category details
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
                  <strong>{productCategory.name}.</strong>
                </span>
              </DialogDescription>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    variant={"destructive"}
                    className="flex-1"
                    onClick={async () => {
                      const success = await deleteProductCategory(
                        productCategory.id,
                      );
                      if (success) {
                        toast({
                          title: `Successfully deleted ${productCategory.name}`,
                        });
                      }
                    }}
                  >
                    Delete {productCategory.name}
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
