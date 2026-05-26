"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sections/Sidebar";

interface Project {
  id: string;
  name: string;
  status: "active" | "paused" | "archived";
  createdAt: string;
}

const INITIAL_PROJECTS: Project[] = [
  { id: "1", name: "Acme Dashboard", status: "active", createdAt: "2025-05-01" },
  { id: "2", name: "Billing Portal", status: "active", createdAt: "2025-04-22" },
  { id: "3", name: "Onboarding Flow", status: "paused", createdAt: "2025-04-10" },
];

const STATUS_STYLES: Record<Project["status"], string> = {
  active: "bg-emerald-50 text-emerald-600",
  paused: "bg-amber-50 text-amber-600",
  archived: "bg-zinc-100 text-zinc-400",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  // Manual create form

  function handleCreate() {
    if (!newName.trim()) return;
    const project: Project = {
      id: Date.now().toString(),
      name: newName.trim(),
      status: "active",
      createdAt: new Date().toISOString().split("T")[0]!,
    };
    setProjects((prev) => [project, ...prev]);
    setNewName("");
    setCreating(false);
  }

  return (
    <div className="flex flex-1 min-h-screen bg-zinc-50">
      <Sidebar />

      {/* data-ai-region/action attributes map page regions and interactive elements to the AI's semantic model */}
      <main data-ai-region="projects" className="flex-1 p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Projects</h1>
            <p className="text-sm text-zinc-400 mt-0.5">{projects.length} total</p>
          </div>
          <button
            data-ai-action="create-project"
            onClick={() => setCreating(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + New project
          </button>
        </div>

        {/* Inline create form */}
        {creating && (
          <div className="mb-4 p-4 bg-white border border-indigo-100 rounded-xl flex items-center gap-3">
            <input
              data-ai-field="project-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Project name"
              autoFocus
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-zinc-300"
            />
            <button
              onClick={handleCreate}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setCreating(false);
                setNewName("");
              }}
              className="px-3 py-1.5 text-zinc-400 text-xs hover:text-zinc-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Project list */}
        <div className="flex flex-col gap-2">
          {projects.length === 0 && (
            <div className="text-center py-16 text-sm text-zinc-400">
              No projects yet — create one or ask the AI assistant.
            </div>
          )}
          {projects.map((project) => (
            <div
              key={project.id}
              data-ai-region={`project-${project.id}`}
              className="flex items-center justify-between bg-white border border-zinc-100 rounded-xl px-4 py-3.5 hover:border-zinc-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-medium text-indigo-500">
                  {project.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-800">{project.name}</div>
                  <div className="text-xs text-zinc-400">{project.createdAt}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[project.status]}`}>
                  {project.status}
                </span>
                <button
                  data-ai-action="delete-project"
                  onClick={() => setProjects((prev) => prev.filter((p) => p.id !== project.id))}
                  className="text-zinc-300 hover:text-red-400 transition-colors text-sm"
                  aria-label={`Delete ${project.name}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI hint */}
        <div className="mt-8 p-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50">
          <p className="text-xs text-indigo-500 font-medium mb-1">AI actions available here</p>
          <p className="text-xs text-indigo-400">
            Try: <em>"create a project called Nova"</em> · <em>"delete Billing Portal"</em> ·{" "}
            <em>"list my projects"</em>
          </p>
        </div>
      </main>
    </div>
  );
}
