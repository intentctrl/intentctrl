"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/dashboard/projects", label: "Projects", icon: "◈" },
  { href: "/dashboard/settings", label: "Settings", icon: "◎" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      data-ai-region="sidebar"
      className="w-56 shrink-0 border-r border-zinc-100 bg-white flex flex-col py-6 px-3 gap-1"
    >
      {/* Logo */}
      <div className="px-3 mb-6">
        <span className="font-semibold text-sm tracking-tight text-zinc-900">
          intentctrl<span className="text-indigo-500">.</span>dev
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-ai-action={`navigate-${item.label.toLowerCase()}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-3">
        <div className="text-[11px] text-zinc-400 font-mono">v0.0.1 · dev</div>
      </div>
    </aside>
  );
}