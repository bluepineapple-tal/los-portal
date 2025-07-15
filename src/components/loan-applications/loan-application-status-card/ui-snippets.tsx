import { Badge } from "@/components/ui/badge";

export const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusStyles: Record<string, string> = {
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
  pending: "bg-yellow-200 text-yellow-800",
  claimed: "bg-blue-200 text-blue-800",
  verified: "bg-green-200 text-green-800",
  failed: "bg-red-200 text-red-800",
};

export function StatusBadge({ value }: Readonly<{ value: string }>) {
  return (
    <Badge className={`px-4 py-1 text-sm ${statusStyles[value]}`}>
      {value.toUpperCase()}
    </Badge>
  );
}
