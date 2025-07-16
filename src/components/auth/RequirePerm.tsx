"use client";

import { forbidden } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { Perm } from "@/lib/auth/permissions";

import { useHasPerm } from "../contexts/authz-provider";

/**
 * Renders `children` only when the current user owns *all* permissions
 * in `perms`. Otherwise it redirects to `/403` (you can customise the
 * destination) and renders nothing.
 */
export function RequirePerm({
  perms,
  children,
}: Readonly<{
  perms: Perm[];
  children: ReactNode;
}>) {
  const allowed = useHasPerm(...perms);

  /* client-side redirect once the AuthZ context is ready */
  useEffect(() => {
    if (!allowed) forbidden();
  }, [allowed]);

  if (!allowed) return null; // while redirecting → nothing
  return <>{children}</>;
}
