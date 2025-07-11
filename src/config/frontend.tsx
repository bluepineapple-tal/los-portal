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
    recipeList: [
      EmailPasswordReact.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "name",
                label: "Full name",
                placeholder: "Jane Doe",
                validate: async (value) =>
                  value.trim().length >= 3 ? undefined : "Name is too short",
              },
              {
                id: "avatar",
                label: "Avatar URL (optional)",
                optional: true,
                validate: async (value) =>
                  value === "" || /^https?:\/\//.test(value)
                    ? undefined
                    : "Enter a valid URL",
              },
            ],
          },
        },
      }),
      SessionReact.init(),
    ],
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
