"use client";

import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";

import { SheetHeader, SheetTitle } from "../ui/sheet";
import { LoanOfferDTO } from "./loan-offer.schema";

/**
 *    Select & drag-handle columns are automatically supplied
 *     by <DataTable>, so we define only *business* columns here.
 */
export const loanOfferTableColumns: ColumnDef<LoanOfferDTO>[] = [
  {
    accessorKey: "offer_name",
    header: "Offer Name",
    meta: {
      detailTrigger: true,
      detailRenderer: (offer: LoanOfferDTO) => (
        <>
          <SheetHeader>
            <SheetTitle>{offer.offer_name}</SheetTitle>
          </SheetHeader>
          <div className="grid gap-2 text-sm">
            <p>
              <strong>Interest&nbsp;Rate:</strong>{" "}
              {parseFloat(offer.interest_rate).toFixed(2)}%
            </p>
            <p>
              <strong>Tenure:</strong> {offer.tenure_months} months
            </p>
            <p>
              <strong>Processing Fee:</strong> ₹{offer.processing_fee}
            </p>
            {offer.offer_details && <p>{offer.offer_details}</p>}
          </div>
        </>
      ),
    },
    cell: ({ row }) => row.original.offer_name,
  },

  {
    accessorKey: "interest_rate",
    header: "Interest Rate (%)",
    cell: ({ row }) => `${Number(row.original.interest_rate).toFixed(2)}%`,
    sortingFn: "basic",
  },

  {
    accessorKey: "tenure_months",
    header: "Tenure (Months)",
    sortingFn: "basic",
  },

  {
    accessorKey: "processing_fee",
    header: "Processing Fee",
    cell: ({ row }) =>
      `₹${Number(row.original.processing_fee).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
    sortingFn: "basic",
  },

  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge variant={isActive ? "success" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    sortingFn: "basic",
  },

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
              Copy Offer ID
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
