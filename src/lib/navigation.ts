import {
  BarChartIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FilePenIcon,
  FilesIcon,
  FolderDown,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  LucideIcon,
  PlusCircleIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { URLS } from "@/lib/constants";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  roles?: string[]; // who can see it (omit = everyone)
  items?: NavItem[]; // support nesting
};

export const NAV_MAIN: NavItem[] = [
  { title: "Dashboard", url: URLS.DASHBOARD, icon: LayoutDashboardIcon },
  {
    title: "Loan Offers",
    url: URLS.LOAN_OFFERS,
    icon: ListIcon,
    roles: ["super-admin", "admin", "support"],
  },
  {
    title: "Loan Applications",
    url: URLS.LOAN_APPLICATIONS,
    icon: FilesIcon,
    roles: ["super-admin", "admin", "support", "consumer"],
  },
  {
    title: "Create Loan Application",
    url: URLS.CREATE_LOAN_APPLICATION,
    icon: FilePenIcon,
    roles: ["consumer"],
  },
  {
    title: "Product Categories",
    url: "#",
    icon: FolderDown,
    roles: ["super-admin", "vendor-manager"],
    items: [
      {
        title: "Create a New Category",
        url: URLS.CREATE_PRODUCT_CATEGORIES,
        icon: PlusCircleIcon,
        roles: ["super-admin", "vendor-manager"],
      },
      {
        title: "View all Categories",
        url: URLS.PRODUCT_CATEGORIES,
        icon: ListIcon,
      },
    ],
  },
  {
    title: "Analytics",
    url: URLS.ANALYTICS,
    icon: BarChartIcon,
    roles: ["admin"],
  },
  { title: "Users", url: URLS.USERS, icon: UsersIcon, roles: ["super-admin"] },
];

export const NAV_SECONDARY: NavItem[] = [
  { title: "Settings", url: "#", icon: SettingsIcon },
  { title: "Get Help", url: "#", icon: HelpCircleIcon },
  { title: "Search", url: "#", icon: SearchIcon },
];

export const NAV_DOCS: NavItem[] = [
  { title: "Data Library", url: "#", icon: DatabaseIcon },
  { title: "Reports", url: "#", icon: ClipboardListIcon },
];
