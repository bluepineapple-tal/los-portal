export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const URLS = {
  DASHBOARD: "/dashboard",
  LOAN_OFFERS: "/loan-offers",
  LOAN_APPLICATIONS: "/loan-applications",
  CREATE_LOAN_APPLICATION: "/loan-applications/create",
  PRODUCT_CATEGORIES: "/product-categories",
  CREATE_PRODUCT_CATEGORIES: "/product-categories/create",
  ANALYTICS: "/analytics",
  USERS: "/users",
};
