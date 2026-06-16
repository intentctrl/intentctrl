import type { LinkItemType } from "@/components/header/sheard";
import { IconPlug, IconLayoutDashboard, IconUsers, IconFileText, IconShield } from "@tabler/icons-react";

export const platformLinks: LinkItemType[] = [
  {
    label: "Features",
    href: "/#features",
    description: "What you can do with the runtime",
    icon: <IconLayoutDashboard />,
  },
  {
    label: "Integrations",
    href: "/#integrations",
    description: "Connect your apps and services",
    icon: <IconPlug />,
  },
];

export const aboutLinks: LinkItemType[] = [];

export const aboutLinks2: LinkItemType[] = [
  {
    label: "About Us",
    href: "/about",
    icon: <IconUsers />,
  },
  {
    label: "Terms of Service",
    href: "/terms-of-service",
    icon: <IconFileText />,
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
    icon: <IconShield />,
  },
];
