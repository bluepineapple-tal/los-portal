"use client";

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface StatsCardProps {
  title: string;
  /** Either a raw number (unformatted) or a fully formatted string (“₹1.2 Cr”) */
  value: number | string;
  /** If true and `value` is a number, formats as ₹xx (en-IN) */
  currency?: boolean;
  /** e.g. -15, 0, +42; if omitted, no badge is shown */
  trendPct?: number;
  /** Small caption under the value */
  subtitle?: string;
}

export function StatsCard({
  title,
  value,
  currency = false,
  trendPct,
  subtitle,
}: Readonly<StatsCardProps>) {
  // Determine if we have a trend to show
  const showTrend = typeof trendPct === "number";
  const isNegative = typeof trendPct === "number" && trendPct < 0;
  const arrowDirection = isNegative ? "down" : "up";
  const trendPercent = `${trendPct! > 0 ? "+" : ""}${trendPct}%`;
  const displayTrend = typeof trendPct === "number" ? trendPercent : "";

  // Format the main value
  let displayedValue: string;
  if (currency && typeof value === "number") {
    displayedValue = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 1,
    }).format(value);
  } else {
    displayedValue = String(value);
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>

        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {displayedValue}
        </CardTitle>

        {showTrend && (
          <div className="absolute right-4 top-4">
            <Badge
              variant="outline"
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              {arrowDirection === "up" ? (
                <TrendingUpIcon className="h-3 w-3" />
              ) : (
                <TrendingDownIcon className="h-3 w-3" />
              )}
              {displayTrend}
            </Badge>
          </div>
        )}
      </CardHeader>

      {subtitle && (
        <CardFooter className="flex flex-col items-start gap-1 text-sm">
          {subtitle}
        </CardFooter>
      )}
    </Card>
  );
}
