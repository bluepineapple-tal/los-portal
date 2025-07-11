// src/components/contexts/page-title.tsx
"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Ctx = { title: string; setTitle: (t: string) => void };

const PageTitleCtx = createContext<Ctx | null>(null);

export function PageTitleProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [title, setTitle] = useState("");
  const set = useCallback((t: string) => setTitle(t), []);

  // Memoize the context value so it's stable across renders
  const value = useMemo(() => ({ title, setTitle: set }), [title, set]);

  return (
    <PageTitleCtx.Provider value={value}>{children}</PageTitleCtx.Provider>
  );
}

export const usePageTitle = () => useContext(PageTitleCtx)?.title ?? "";

export const useSetPageTitle = () => {
  const ctx = useContext(PageTitleCtx);
  if (!ctx) throw new Error("useSetPageTitle must be inside provider");
  return ctx.setTitle;
};

/* tiny client component to be used in route layouts */
export function PageTitle({ title }: { title: string }) {
  const setTitle = useSetPageTitle();
  // update on mount only
  useEffect(() => setTitle(title), [setTitle, title]);
  return null;
}
