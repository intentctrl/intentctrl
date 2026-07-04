"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setIsDark(next === "dark");
    setTheme(next);
  }, [theme, setTheme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "m" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  return (
    <div className="group inline-flex items-center gap-2">
      <span
        className={cn("cursor-pointer text-left text-sm font-medium", isDark && "text-foreground/50")}
        onClick={() => {
          setIsDark(false);
          setTheme("light");
        }}
      >
        <IconSun className="size-4" aria-hidden="true" />
      </span>

      <Switch
        checked={isDark}
        onCheckedChange={(checked) => {
          setIsDark(checked);
          setTheme(checked ? "dark" : "light");
        }}
        aria-label="Toggle between dark and light mode"
      />

      <span
        className={cn("cursor-pointer text-right text-sm font-medium", isDark || "text-foreground/50")}
        onClick={() => {
          setIsDark(true);
          setTheme("dark");
        }}
      >
        <IconMoon className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}
