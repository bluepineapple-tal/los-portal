"use client";

import { ArrowUpCircleIcon } from "lucide-react";
import Link from "next/link";
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
import { UserDTO } from "./onboarding/user.schema";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { fetchApi } from "@/lib/fetch-api";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSessionContext();
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    // guard *inside* the effect
    if (session.loading || !session.doesSessionExist) return;

    let cancelled = false;
    fetchApi<UserDTO>(`${API_BASE_URL}/users/st/${session.userId}`)
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch((err) => {
        console.error("Failed to fetch sidebar user:", err);
      });
    return () => {
      cancelled = true;
    };
    // @ts-expect-error session
  }, [session.loading, session.doesSessionExist, session.userId]);

  if (session.loading || !session.doesSessionExist) {
    return null;
  }

  const accessTokenPayload = session.accessTokenPayload;
  const roles: string[] = accessTokenPayload["st-role"].v ?? [];

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
