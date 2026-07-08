import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { platformLinks } from "@/components/header/nav-links";
import { LinkItem } from "@/components/header/sheard";
import Link from "next/link";

export function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem className="bg-transparent">
          <NavigationMenuTrigger className="bg-transparent">Platform</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
            <div className="rounded-lg grid w-lg grid-cols-2 gap-2 border bg-popover p-2 shadow">
              {platformLinks.map((item, i) => (
                <NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
                  <LinkItem {...item} />
                </NavigationMenuLink>
              ))}
            </div>
            <div className="p-2">
              <p className="text-muted-foreground text-sm">
                Interested?{" "}
                <Link className="font-medium text-foreground hover:underline" href="/#contact">
                  Get in touch
                </Link>
              </p>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuLink asChild className="px-4">
          <Link className="rounded-md p-2 hover:bg-accent" href="/#pricing">
            Pricing
          </Link>
        </NavigationMenuLink> */}
        <NavigationMenuLink asChild className="px-4">
          <Link className="rounded-md p-2 hover:bg-accent" href="https://docs.intentctrl.com">
            Docs
          </Link>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
