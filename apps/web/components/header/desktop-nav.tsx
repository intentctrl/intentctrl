import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { aboutLinks, aboutLinks2, platformLinks } from "@/components/header/nav-links";
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
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">About</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 pb-1.5 dark:bg-background">
            <div className="grid w-48 grid-cols-1 gap-2">
              {/* <div className="grid w-lg grid-cols-2 gap-2"> */}
              {/* <div className="rounded-lg space-y-2 border bg-popover p-2 shadow">
                {aboutLinks.map((item, i) => (
                  <NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
                    <LinkItem {...item} />
                  </NavigationMenuLink>
                ))}
              </div> */}
              <div className="space-y-2 p-3">
                {aboutLinks2.map((item, i) => (
                  <NavigationMenuLink href={item.href} key={`item-${item.label}-${i}`}>
                    {item.icon}
                    {item.label}
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuLink asChild className="px-4">
          <Link className="rounded-md p-2 hover:bg-accent" href="/#pricing">
            Pricing
          </Link>
        </NavigationMenuLink>
        <NavigationMenuLink asChild className="px-4">
          <Link className="rounded-md p-2 hover:bg-accent" href="https://docs.intentctrl.com">
            Docs
          </Link>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
