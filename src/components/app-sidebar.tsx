"use client";

import { ArrowUpCircleIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { filterNavByRole } from "@/lib/filter-nav";
import { NAV_DOCS, NAV_MAIN, NAV_SECONDARY } from "@/lib/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSessionContext();

  if (session.loading) return null; // or a skeleton
  if (!session.doesSessionExist) return null; // shouldn't happen (SessionAuth wrapper)

  const accessTokenPayload = session.accessTokenPayload;
  const roles: string[] = accessTokenPayload["st-role"].v ?? [];
  const user = {
    name: accessTokenPayload.name ?? "User",
    email: accessTokenPayload.email ?? "",
    avatar: accessTokenPayload.avatar ?? "/avatars/default.png",
  };

  const navMain = filterNavByRole(NAV_MAIN, roles);
  const navDocs = filterNavByRole(NAV_DOCS, roles);
  const navSecondary = filterNavByRole(NAV_SECONDARY, roles);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">LOS Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={navDocs} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
