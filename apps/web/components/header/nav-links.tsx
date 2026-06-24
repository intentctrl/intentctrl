import type { LinkItemType } from "@/components/header/sheard";
import { IconPlug, IconLayoutDashboard, IconCloud, IconUsers, IconFileText, IconShield } from "@tabler/icons-react";

export const platformLinks: LinkItemType[] = [
  {
    label: "Cloud Platform",
    href: "https://app.intentctrl.com",
    description: "Hosted platform with analytics and session history",
    icon: <IconCloud />,
  },
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
