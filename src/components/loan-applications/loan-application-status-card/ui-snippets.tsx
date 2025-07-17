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

type StatusBadgeProps = {
  value: string;
};

export function StatusBadge({ value }: Readonly<StatusBadgeProps>) {
  const map: Record<string, "success" | "destructive" | "outline"> = {
    approved: "success",
    rejected: "destructive",
    claimed: "success",
    draft: "outline",
    submitted: "outline",
    "under review": "destructive",
    escalated: "outline",
    verified: "success",
    success: "success",
    failed: "destructive",
    pending: "outline",
  };

  return <Badge variant={map[value] ?? "outline"}>{value.toUpperCase()}</Badge>;
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
