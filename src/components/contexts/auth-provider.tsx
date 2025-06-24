"use client";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
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
      {children}
    </SessionAuth>
  );
};

export default AuthProvider;
