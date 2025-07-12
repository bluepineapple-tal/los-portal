import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Trend = { pct: number; direction: "up" | "down" };

export interface StatsCardProps {
  title: string;
  value: string; // already formatted (“₹1.2 Cr”, “24 h” …)
  trend?: Trend; // optional
  subtitle?: string; // small extra line
}

export function StatsCard({
  title,
  value,
  trend,
  subtitle,
}: Readonly<StatsCardProps>) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>

        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>

        {trend && (
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {trend.direction === "up" ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
              {trend.pct > 0 ? `+${trend.pct}%` : `${trend.pct}%`}
            </Badge>
          </div>
        )}
      </CardHeader>

      {subtitle && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1">{subtitle}</div>
        </CardFooter>
      )}
    </Card>
  );
}
