"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sections/Sidebar";

interface SettingsForm {
  displayName: string;
  email: string;
  notifications: boolean;
  theme: "light" | "dark" | "system";
}

const INITIAL: SettingsForm = {
  displayName: "Demo User",
  email: "demo@intentctrl.dev",
  notifications: true,
  theme: "system",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(INITIAL);
  const [saved, setSaved] = useState(false);

  function patch(values: Partial<SettingsForm>) {
    setForm((prev) => ({ ...prev, ...values }));
    setSaved(false);
  }

  function save() {
    // In a real app: await api.settings.update(form)
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-1 min-h-screen bg-zinc-50">
      <Sidebar />

      {/* data-ai-region/field/action attributes let the AI identify, read, and interact with page elements */}
      <main data-ai-region="settings" className="flex-1 p-8 max-w-xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage your account preferences</p>
        </div>

        <div className="bg-white border border-zinc-100 rounded-xl divide-y divide-zinc-50">
          {/* Display name */}
          <div className="p-5">
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Display name
            </label>
            <input
              data-ai-field="display-name"
              type="text"
              value={form.displayName}
              onChange={(e) => patch({ displayName: e.target.value })}
              className="w-full text-sm text-zinc-800 border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Email */}
          <div className="p-5">
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Email
            </label>
            <input
              data-ai-field="email"
              type="email"
              value={form.email}
              onChange={(e) => patch({ email: e.target.value })}
              className="w-full text-sm text-zinc-800 border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Notifications */}
          <div className="p-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-800">Email notifications</div>
              <div className="text-xs text-zinc-400 mt-0.5">Receive updates and activity digests</div>
            </div>
            <button
              data-ai-action="toggle-notifications"
              onClick={() => patch({ notifications: !form.notifications })}
              className={`relative w-10 h-5.5 rounded-full transition-colors ${
                form.notifications ? "bg-indigo-500" : "bg-zinc-200"
              }`}
              aria-label={form.notifications ? "Disable notifications" : "Enable notifications"}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  form.notifications ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Theme */}
          <div className="p-5">
            <label className="block text-xs font-medium text-zinc-500 mb-2">Theme</label>
            <div className="flex gap-2" data-ai-field="theme">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => patch({ theme: t })}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize ${
                    form.theme === t
                      ? "border-indigo-400 bg-indigo-50 text-indigo-600 font-medium"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="mt-4 flex items-center gap-3">
          <button
            data-ai-action="save-settings"
            onClick={save}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Save changes
          </button>
          {saved && (
            <span className="text-xs text-emerald-500 font-medium">Saved ✓</span>
          )}
        </div>

        {/* AI hint */}
        <div className="mt-8 p-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50">
          <p className="text-xs text-indigo-500 font-medium mb-1">AI actions available here</p>
          <p className="text-xs text-indigo-400">
            Try: <em>"set my name to Alex"</em> · <em>"disable notifications"</em> · <em>"save settings"</em>
          </p>
        </div>
      </main>
    </div>
  );
}