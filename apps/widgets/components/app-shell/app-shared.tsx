import type { ReactNode } from "react";
import { IconLayoutGrid, IconBook, IconMessage2 } from "@tabler/icons-react";
import { Github } from "@react-symbols/icons/files";

export type SidebarNavItem = {
  title: string;
  path: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    items: [
      {
        title: "All Widgets",
        path: "/widgets",
        icon: <IconLayoutGrid />,
      },
    ],
  },
  {
    label: "Widgets",
    items: [
      {
        title: "Popover Chat",
        path: "/widgets/popover-chat",
        icon: <IconMessage2 />,
      },
    ],
  },
];

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Documentation",
    path: "https://docs.intentctrl.com",
    icon: <IconBook />,
  },
  {
    title: "GitHub",
    path: "https://github.com/intentctrl/intentctrl",
    icon: <Github className="size-5" />,
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) => (item.subItems?.length ? [item, ...item.subItems] : [item])),
  ),
  ...footerNavLinks,
];
