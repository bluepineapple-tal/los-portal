"use client";

import {
  LucideIcon,
  PlusCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useState } from "react";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleItem = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const isOpen = openMenus[item.title];

            return (
              <SidebarMenuItem key={item.title} className="flex flex-col gap-1">
                {item.items?.length ? (
                  <SidebarMenuButton
                    className="flex items-center justify-between gap-2 w-full"
                    onClick={() => toggleItem(item.title)}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}

                {/* Safe submenu rendering */}
                {Array.isArray(item.items) &&
                  item.items.length > 0 &&
                  isOpen && (
                    <div className="ml-4 border-l border-muted pl-4">
                      {item.items.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <SidebarMenuButton
                            asChild
                            key={sub.title}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                          >
                            <Link href={sub.url}>
                              {SubIcon && <SubIcon className="mr-2 h-3 w-3" />}
                              <span>{sub.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        );
                      })}
                    </div>
                  )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
