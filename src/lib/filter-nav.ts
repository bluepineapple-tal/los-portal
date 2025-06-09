import { NavItem } from "./navigation";

export function filterNavByRole(items: NavItem[], roles: string[]): NavItem[] {
  return items
    .filter((item) => !item.roles || item.roles.some((r) => roles.includes(r)))
    .map((item) =>
      item.items
        ? { ...item, items: filterNavByRole(item.items, roles) }
        : item,
    )
    .filter(
      // drop parents that lost all children
      (item) => !item.items || item.items.length > 0,
    );
}
