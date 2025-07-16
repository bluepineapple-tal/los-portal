import { useRouter } from "next/navigation";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword";
import SessionReact from "supertokens-auth-react/recipe/session";

import { appInfo } from "./appInfo";

const routerInfo: { router?: ReturnType<typeof useRouter>; pathName?: string } =
  {};

export function setRouter(
  router: ReturnType<typeof useRouter>,
  pathName: string,
) {
  routerInfo.router = router;
  routerInfo.pathName = pathName;
}

export const frontendConfig = (): SuperTokensConfig => {
  return {
    appInfo,
    getRedirectionURL: async (context) => {
      // Runs for every auth event (email-password, social, passwordless …)
      if (context.action === "SUCCESS") {
        // If a deep-link is already stored (e.g. user hit a protected page),
        // let SuperTokens honour it. Otherwise go to the dashboard.
        return context.redirectToPath ?? "/dashboard";
      }
      return undefined; // fall back to built-ins for everything else
    },
    recipeList: [EmailPasswordReact.init(), SessionReact.init()],
    windowHandler: (original) => ({
      ...original,
      location: {
        ...original.location,
        getPathName: () => routerInfo.pathName!,
        assign: (url) => routerInfo.router!.push(url.toString()),
        setHref: (url) => routerInfo.router!.push(url.toString()),
      },
    }),
    // enableDebugLogs: process.env.NODE_ENV === "development",
  };
};
