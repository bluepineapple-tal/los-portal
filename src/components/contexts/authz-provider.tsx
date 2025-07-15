"use client";
import { createContext, useContext, useMemo } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { Perm, Role } from "@/lib/auth/permissions";

/* ---------- public API --------------------------------------------- */
type Ctx = {
  userId: string;
  roles: Role[];
  perms: Set<Perm>;
  hasPerm: (...p: Perm[]) => boolean;
  hasRole: (...r: Role[]) => boolean;
};

const AuthzCtx = createContext<Ctx | null>(null);

/* ---------- provider ------------------------------------------------ */
export function AuthzProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = useSessionContext();

  const ctx = useMemo<Ctx | null>(() => {
    if (session.loading || !session.doesSessionExist) return null;

    const roles: Role[] = session.accessTokenPayload["st-role"]?.v ?? [];
    const perms = new Set<Perm>(
      (session.accessTokenPayload["st-perm"]?.v ?? []) as Perm[],
    );

    const hasPerm = (...p: Perm[]) => p.every((perm) => perms.has(perm));
    const hasRole = (...r: Role[]) => r.some((role) => roles.includes(role));

    return { userId: session.userId, roles, perms, hasPerm, hasRole };
  }, [session]);

  /* Render children unconditionally so public pages work  */
  return <AuthzCtx.Provider value={ctx}>{children}</AuthzCtx.Provider>;
}

/* ---------- hooks --------------------------------------------------- */
export const useAuthz = () => useContext(AuthzCtx)!;
export const useHasPerm = (...p: Perm[]) => useAuthz()?.hasPerm(...p) ?? false;
export const useHasRole = (...r: Role[]) => useAuthz()?.hasRole(...r) ?? false;
