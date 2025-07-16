import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Badge, BadgeProps } from "@/components/ui/badge";
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
import { LoanApplicationDTO, statusLabels } from "./loan-application.schema";
import Link from "next/link";
import { URLS } from "@/lib/constants";

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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const a = row.original;
      return a.consumer.user.email;
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
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: BadgeProps["variant"] = "default";

      switch (row.original.status) {
        case "approved":
          variant = "success";
          break;
        case "claimed":
          variant = "success";
          break;
        case "draft":
          variant = "secondary";
          break;
        case "under_review":
          variant = "outline";
          break;
        case "rejected":
          variant = "destructive";
          break;
        default:
          break;
      }
      return <Badge variant={variant}>{statusLabels[status] ?? status}</Badge>;
    },
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
    accessorKey: "product_category",
    header: "Product Category",
    cell: ({ row }) => row.original.productCategory?.name ?? "—",
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: ({ row, table }) => {
      const app = row.original;
      // grab setter we passed via meta
      const { setEditing, canEdit } = table.options.meta as {
        setEditing: (o: LoanApplicationDTO) => void;
        canEdit: boolean;
      };

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
              onClick={() => navigator.clipboard.writeText(app.id)}
            >
              Copy Loan Application ID
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(app.id)}
            >
              <Link href={`${URLS.LOAN_APPLICATIONS}/${app.id}`}>
                View Application Details
              </Link>
            </DropdownMenuItem>

            {canEdit && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setEditing?.(app)}>
                  Edit
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
