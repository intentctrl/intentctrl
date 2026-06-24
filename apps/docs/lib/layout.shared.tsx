import type { BaseLayoutProps } from "@/layouts/shared";
import { appName, gitConfig } from "./shared";
import { Logo } from "@/components/logo";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Logo className="size-6" />
          <span className="font-medium in-[.uwu]:hidden">{appName}</span>
        </>
      ),
    },
    links: [
      {
        type: "main",
        text: "Sign In",
        url: "https://app.intentctrl.com/sign-in",
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
