import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { LoanApplicationDTO } from "./loan-application.schema";

export const loanApplicationTableColumns: ColumnDef<LoanApplicationDTO>[] = [
  {
    accessorKey: "consumer",
    header: "Applicant",
    cell: ({ row }) => {
      const a = row.original;
      return `${a.consumer.user.first_name} ${a.consumer.user.last_name}`;
    },
  },
  {
    accessorKey: "requested_amount",
    header: "Amount (₹)",
    cell: ({ row }) =>
      row.original.requested_amount?.toLocaleString("en-IN") ?? "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
  {
    accessorKey: "application_date",
    header: "Applied on",
    cell: ({ row }) => format(row.original.application_date, "PPP"),
  },
  {
    accessorKey: "loan_offer",
    header: "Loan offer",
    cell: ({ row }) => row.original.selectedOffer?.offer_name ?? "—",
  },
  {
    id: "actions",
    header: "",
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
              Copy Loan Application ID
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
