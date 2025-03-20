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
import { deleteProductMake } from "@/lib/functions/product-make.api";
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
import { IProductMake, ProductStatus } from "./product.interface";

export const productMakeTableColumns: ColumnDef<IProductMake>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Make" />
    ),
    cell: ({ row }) => {
      const productMake = row.original;
      return (
        <Link
          href={`/products/${productMake.slug}`}
          className="hover:text-blue-500"
        >
          {productMake.name}
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
      const productMake = row.original;

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
                onClick={() => navigator.clipboard.writeText(productMake.id)}
              >
                Copy product make ID
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/products/${productMake.slug}`}>
                  View make details
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
                  <strong>{productMake.name}.</strong>
                </span>
              </DialogDescription>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    variant={"destructive"}
                    className="flex-1"
                    onClick={async () => {
                      const success = await deleteProductMake(productMake.id);
                      if (success) {
                        toast({
                          title: `Successfully deleted ${productMake.name}`,
                        });
                      }
                    }}
                  >
                    Delete {productMake.name}
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
