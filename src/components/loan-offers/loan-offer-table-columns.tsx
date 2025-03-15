"use client";

import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { ColumnDef } from "@tanstack/react-table";

export interface ILoanOffer {
  id: string;
  productId: string;
  offer_name: string;
  interest_rate: number;
  tenure_months: number;
  processing_fee: number;
  offer_details?: string;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export const loanOfferTableColumns: ColumnDef<ILoanOffer>[] = [
  // 1) Checkbox for row selection
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
  // 2) Offer Name
  {
    accessorKey: "offer_name",
    header: "Offer Name",
    cell: ({ row }) => row.getValue("offer_name"),
  },
  // 3) Interest Rate
  {
    accessorKey: "interest_rate",
    header: "Interest Rate (%)",
    cell: ({ row }) => {
      const rate = row.getValue<number>("interest_rate");
      return `${rate.toFixed(2)}%`;
    },
  },
  // 4) Tenure (Months)
  {
    accessorKey: "tenure_months",
    header: "Tenure (Months)",
  },
  // 5) Processing Fee
  {
    accessorKey: "processing_fee",
    header: "Processing Fee",
    cell: ({ row }) => {
      const fee = row.getValue<number>("processing_fee");
      return `₹${fee.toFixed(2)}`;
    },
  },
  // 6) Is Active (Badge)
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>("is_active");
      return (
        <Badge variant={isActive ? "success" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  // 7) Actions
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const offer = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(offer.id)}
            >
              Copy Offer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* TODO: Link to a Loan Offer detail page */}
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
