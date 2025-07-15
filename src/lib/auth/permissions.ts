export type Role =
  | "super-admin"
  | "admin"
  | "support"
  | "compliance-auditor"
  | "underwriter"
  | "vendor-manager"
  | "vendor-agent"
  | "consumer";

export const Perm = {
  LOAN_CREATE: "loan:create",
  LOAN_READ: "loan:read",
  LOAN_UPDATE: "loan:update",
  LOAN_DELETE: "loan:delete",

  AUTH_READ: "auth:read",
  AUTH_MANAGE: "auth:manage",

  PRODUCT_MANAGE: "product:manage",

  EXTERNAL_VIEW: "external:view",
  EXTERNAL_TRIGGER: "external:trigger",

  UNDER_READ: "underwriter:read",
  UNDER_APPROVE: "underwriter:approve",
  UNDER_OVERRIDE: "underwriter:override",

  REPORT_VIEW: "report:view",
  REPORT_EXPORT: "report:export",

  CONFIG_MANAGE: "config:manage",
  AUDIT_VIEW: "audit:view",
} as const;

export type Perm = (typeof Perm)[keyof typeof Perm];

/* Roles → permissions map (single source of truth) */
export const RolePerms: Record<Role, Perm[]> = {
  "super-admin": [
    Perm.LOAN_CREATE,
    Perm.LOAN_READ,
    Perm.LOAN_UPDATE,
    Perm.LOAN_DELETE,
    Perm.AUTH_MANAGE,
    Perm.AUTH_READ,
    Perm.EXTERNAL_TRIGGER,
    Perm.EXTERNAL_VIEW,
    Perm.UNDER_READ,
    Perm.UNDER_APPROVE,
    Perm.UNDER_OVERRIDE,
    Perm.REPORT_VIEW,
    Perm.REPORT_EXPORT,
    Perm.CONFIG_MANAGE,
    Perm.AUDIT_VIEW,
  ],
  admin: [
    Perm.LOAN_READ,
    Perm.EXTERNAL_VIEW,
    Perm.REPORT_VIEW,
    Perm.AUTH_MANAGE,
    Perm.CONFIG_MANAGE,
    Perm.REPORT_EXPORT,
    Perm.PRODUCT_MANAGE,
  ],
  support: [Perm.LOAN_READ, Perm.EXTERNAL_VIEW, Perm.REPORT_VIEW],
  "compliance-auditor": [
    Perm.LOAN_READ,
    Perm.EXTERNAL_VIEW,
    Perm.UNDER_READ,
    Perm.AUDIT_VIEW,
    Perm.REPORT_EXPORT,
  ],
  underwriter: [
    Perm.LOAN_READ,
    Perm.UNDER_READ,
    Perm.UNDER_APPROVE,
    Perm.UNDER_OVERRIDE,
    Perm.REPORT_VIEW,
  ],
  "vendor-manager": [
    Perm.LOAN_CREATE,
    Perm.LOAN_READ,
    Perm.LOAN_UPDATE,
    Perm.LOAN_DELETE,
    Perm.EXTERNAL_VIEW,
    Perm.EXTERNAL_TRIGGER,
    Perm.REPORT_VIEW,
    Perm.REPORT_EXPORT,
  ],
  "vendor-agent": [
    Perm.LOAN_CREATE,
    Perm.LOAN_READ,
    Perm.LOAN_UPDATE,
    Perm.EXTERNAL_VIEW,
    Perm.EXTERNAL_TRIGGER,
  ],
  consumer: [Perm.LOAN_CREATE, Perm.LOAN_READ, Perm.LOAN_UPDATE],
};
