export const appInfo = {
  // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
  appName: process.env.APP_NAME ?? "LOS",
  apiDomain: process.env.API_DOMAIN ?? "http://localhost:8000",
  websiteDomain: process.env.WEBSITE_DOMAIN ?? "http://localhost:3000",
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
};
