"use client";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";
import {
  SessionAuth,
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
import { AccessDeniedScreen } from "supertokens-auth-react/recipe/session/prebuiltui";

type Props = {
  children: ReactNode;
};

const AuthProvider: FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  /* 🔒 Protect everything except /auth/* */

  return isAuthRoute ? (
    children
  ) : (
    <SessionAuth requireAuth accessDeniedScreen={AccessDeniedScreen}>
      <ProfileGate>{children}</ProfileGate>
    </SessionAuth>
  );
};

export default AuthProvider;

/* ------------------------------------------------------------------ */
/* internal guard – reads profileComplete from the JWT                 */
/* ------------------------------------------------------------------ */

const EXEMPT_PATHS = ["/onboarding", "/auth"];

const ProfileGate: FC<{ children: ReactNode }> = ({ children }) => {
  const session = useSessionContext();
  const pathname = usePathname();
  const router = useRouter();

  const sessionLoaded = !session.loading && session.doesSessionExist;

  useEffect(() => {
    if (!sessionLoaded) return;

    const complete = Boolean(session.accessTokenPayload.profileComplete);

    // first login, profile not done → push to /onboarding
    if (!complete && !EXEMPT_PATHS.some((p) => pathname.startsWith(p))) {
      router.replace("/onboarding");
    }

    // user already complete but is on /onboarding → send home
    if (complete && pathname.startsWith("/onboarding")) {
      router.replace("/");
    }
  }, [
    pathname,
    router,
    session.loading,
    // @ts-expect-error accessTokenPayload missing
    session.accessTokenPayload.profileComplete,
    sessionLoaded,
  ]);

  return <>{children}</>;
};
