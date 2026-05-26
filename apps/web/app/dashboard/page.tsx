import { Sidebar } from "@/components/sections/Sidebar";
import Link from "next/link";

const STATS = [
  { label: "Projects", value: "4", delta: "+1 this week" },
  { label: "Actions fired", value: "38", delta: "+12 today" },
  { label: "Intents resolved", value: "21", delta: "84% success" },
  { label: "Teach workflows", value: "3", delta: "active" },
];

const QUICK_LINKS = [
  { href: "/dashboard/projects", label: "View Projects", description: "Manage your projects" },
  { href: "/dashboard/settings", label: "Settings", description: "Configure your account" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 min-h-screen bg-zinc-50">
      <Sidebar />

      {/* data-ai-region marks page sections for the AI to identify; data-ai-action on links maps to registered action names */}
      <main data-ai-region="dashboard" className="flex-1 p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-0.5">IntentCtrl demo workspace</p>
        </div>

        <section data-ai-region="stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-zinc-100 p-4"
            >
              <div className="text-xs text-zinc-400 mb-1">{stat.label}</div>
              <div className="text-2xl font-semibold text-zinc-900 tracking-tight">{stat.value}</div>
              <div className="text-xs text-zinc-400 mt-1">{stat.delta}</div>
            </div>
          ))}
        </section>

        <section data-ai-region="quick-links">
          <h2 className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wider">
            Quick access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-ai-action={`navigate-${link.label.toLowerCase().replace(" ", "-")}`}
                className="flex items-center justify-between bg-white border border-zinc-100 rounded-xl p-4 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors group"
              >
                <div>
                  <div className="text-sm font-medium text-zinc-800">{link.label}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{link.description}</div>
                </div>
                <span className="text-zinc-300 group-hover:text-indigo-400 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 p-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50">
          <p className="text-xs text-indigo-500 font-medium mb-1">Try the AI assistant ↘</p>
          <p className="text-xs text-indigo-400">
            Say things like <em>"go to projects"</em>, <em>"create a project called Acme"</em>, or{" "}
            <em>"open settings"</em>
          </p>
        </div>
      </main>
    </div>
  );
}