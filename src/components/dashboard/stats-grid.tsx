"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { API_BASE_URL } from "@/lib/constants";
import { fetchApi } from "@/lib/fetch-api";

import { StatsCard, StatsCardProps } from "./stats-card";

export function StatsGrid() {
  const [cards, setCards] = useState<StatsCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  const session = useSessionContext();

  // fetch once on mount (simplest possible demo)
  useEffect(() => {
    (async () => {
      if (session.loading) return;
      setLoading(true);
      try {
        const res = await fetchApi<{ cards: StatsCardProps[] }>(
          `${API_BASE_URL}/dashboard/`,
        );
        setCards(res.cards);
      } finally {
        setLoading(false);
      }
    })();
    // @ts-expect-error accessTk
  }, [session.accessTokenPayload.idRefreshToken, session.loading]);

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
