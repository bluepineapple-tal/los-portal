export const appInfo = {
  // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "LOS",
  apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN ?? "http://localhost:8000",
  websiteDomain:
    process.env.NEXT_PUBLIC_WEBSITE_DOMAIN ?? "http://localhost:3000",
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
};
