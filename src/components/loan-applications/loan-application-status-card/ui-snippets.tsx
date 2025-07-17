import { Badge } from "@/components/ui/badge";

export const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function FormatNumber(n: number, digits = 0) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

const statusStyles: Record<string, string> = {
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
  pending: "bg-yellow-200 text-yellow-800",
  claimed: "bg-blue-200 text-blue-800",
  verified: "bg-green-200 text-green-800",
  failed: "bg-red-200 text-red-800",
  success: "bg-green-200 text-green-800",
};

type StatusBadgeProps = {
  value: string;
};

export function StatusBadge({ value }: Readonly<StatusBadgeProps>) {
  const normalized = value.toLowerCase();

  return (
    <Badge
      className={`px-4 py-1 text-sm ${statusStyles[normalized] ?? "bg-gray-100 text-gray-800"}`}
    >
      {value.toUpperCase()}
    </Badge>
  );
}

export function VerdictBadge({ value }: Readonly<{ value: string }>) {
  const map: Record<string, "success" | "destructive" | "outline"> = {
    SUCCESS: "success",
    APPROVE: "success",
    VERIFIED: "success",
    FAILED: "destructive",
    REJECT: "destructive",
  };
  return <Badge variant={map[value] ?? "outline"}>{value}</Badge>;
}
