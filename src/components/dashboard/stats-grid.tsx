"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { API_BASE_URL } from "@/lib/constants";
import { fetchApi } from "@/lib/fetch-api";

import { StatsCard, StatsCardProps } from "./stats-card";

export function StatsGrid() {
  const [cards, setCards] = useState<StatsCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "vendor" | "consumer">("consumer");

  const session = useSessionContext();

  useEffect(() => {
    if (session.loading) return;

    const accessTokenPayload = session.accessTokenPayload;
    const roles: string[] = accessTokenPayload["st-role"].v ?? [];
    if (roles.includes("admin")) setRole("admin");
    else if (roles.includes("vendor")) setRole("vendor");
    else setRole("consumer");
    // @ts-expect-error accessTk
  }, [role, session.accessTokenPayload, session.loading]);

  // fetch once on mount (simplest possible demo)
  useEffect(() => {
    (async () => {
      if (session.loading) return;
      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await fetchApi<any>(`${API_BASE_URL}/dashboard/${role}`);

        switch (role) {
          case "admin":
            setCards([
              {
                title: "New applications (24 h)",
                value: res.newApps24h.toLocaleString(),
                trend: {
                  pct: res.newAppsTrend,
                  direction: res.newAppsTrend >= 0 ? "up" : "down",
                },
                subtitle: "vs. previous 24 h",
              },
              {
                title: "Approved this month",
                value: res.approvedMonth.toLocaleString(),
                trend: {
                  pct: res.approvedTrend,
                  direction: res.approvedTrend >= 0 ? "up" : "down",
                },
                subtitle: "Month-to-date",
              },
              {
                title: "Rejection rate",
                value: res.rejectRate + "%",
                trend: {
                  pct: res.rejectRateTrend,
                  direction: res.rejectRateTrend <= 0 ? "up" : "down",
                },
                subtitle: "Quality of pipeline",
              },
              {
                title: "Total disbursed",
                value: `₹${(res.totalDisbursed / 1_00_000).toFixed(1)} L`,
              },
            ]);
            break;

          case "vendor":
            setCards([
              {
                title: "Applications referred",
                value: res.appsReferred.toString(),
                trend: {
                  pct: res.appsTrend,
                  direction: res.appsTrend >= 0 ? "up" : "down",
                },
              },
              {
                title: "Commission earned",
                value: `₹${res.commission.toLocaleString()}`,
              },
              {
                title: "Avg. ticket size",
                value: `₹${res.avgTicket.toLocaleString()}`,
              },
            ]);
            break;

          case "consumer":
            setCards([
              {
                title: "Active loans",
                value: res.activeLoans.toString(),
              },
              {
                title: "Upcoming EMI",
                value: `₹${res.nextEmi.toLocaleString()}`,
                subtitle: `Due on ${res.nextEmiDate}`,
              },
              {
                title: "Credit score",
                value: res.creditScore.toString(),
                trend: {
                  pct: res.scoreTrend,
                  direction: res.scoreTrend >= 0 ? "up" : "down",
                },
              },
            ]);
            break;

          default:
            setCards([
              { title: "Active loans", value: res.activeLoans.toString() },
              /* … */
            ]);
        }
      } finally {
        setLoading(false);
      }
    })();
    // @ts-expect-error accessTk
  }, [role, session.accessTokenPayload.idRefreshToken, session.loading]);

  if (loading || session.loading) return <p className="p-4">Loading…</p>;
  if (!session.doesSessionExist) return null; // shouldn't happen (SessionAuth wrapper)

  return (
    <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      {cards.map((c) => (
        <StatsCard key={c.title} {...c} />
      ))}
    </div>
  );
}
