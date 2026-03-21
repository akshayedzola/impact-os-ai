"use client";
import { useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { Layers, Users, GitBranch, Shield } from "lucide-react";

interface UserStory {
  as: string;
  want: string;
  so: string;
}

interface Module {
  name: string;
  purpose?: string;
  primary_users?: string[];
  user_stories?: (UserStory | string)[];
  core_fields?: string[];
  workflows?: string[];
  permissions?: Record<string, string>;
  phase?: string | number;
  dependencies?: string[];
}

interface ModuleSpecs {
  modules: Module[];
}

export default function ModulesPage() {
  const { currentProject } = useProjectStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!currentProject) return null;

  const moduleSpecs = currentProject.module_specs as ModuleSpecs | null;

  if (!moduleSpecs || !moduleSpecs.modules) {
    return (
      <div className="text-center py-20">
        <Layers className="w-12 h-12 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">Module specifications not yet generated.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Module Specifications</h1>
        <p className="text-white/50 text-sm">
          <span className="text-[#b8ff4f]">A — Align:</span>{" "}
          {moduleSpecs.modules.length} modules designed for{" "}
          {currentProject.project_title}
        </p>
      </div>

      <div className="space-y-3">
        {moduleSpecs.modules.map((mod) => {
          const isOpen = expanded === mod.name;
          return (
            <div
              key={mod.name}
              className="bg-[#0f1a17] border border-white/8 rounded-xl overflow-hidden"
            >
              {/* Module header */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : mod.name)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/3 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#b8ff4f]/10 border border-[#b8ff4f]/20 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4 text-[#b8ff4f]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{mod.name}</div>
                  {mod.purpose && (
                    <div className="text-xs text-white/40 truncate mt-0.5">
                      {mod.purpose}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {mod.phase && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#b8ff4f]/10 text-[#b8ff4f] border border-[#b8ff4f]/20">
                      Phase {mod.phase}
                    </span>
                  )}
                  <span className="text-white/30 text-xs">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-5 pb-5 border-t border-white/6 pt-4 space-y-4">
                  {mod.primary_users && mod.primary_users.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Users className="w-3.5 h-3.5 text-white/30" />
                        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                          Primary Users
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mod.primary_users.map((u) => (
                          <span
                            key={u}
                            className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60"
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {mod.user_stories && mod.user_stories.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <GitBranch className="w-3.5 h-3.5 text-white/30" />
                        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                          User Stories
                        </span>
                      </div>
                      <div className="space-y-2">
                        {mod.user_stories.map((story, i) => (
                          <div
                            key={i}
                            className="text-xs text-white/60 bg-white/3 rounded-lg px-3 py-2 border border-white/6"
                          >
                            {typeof story === "string" ? (
                              story
                            ) : (
                              <>
                                <span className="text-white/40">As a </span>
                                <span className="text-white/80">{story.as}</span>
                                <span className="text-white/40">, I want to </span>
                                <span className="text-white/80">{story.want}</span>
                                {story.so && (
                                  <>
                                    <span className="text-white/40">, so that </span>
                                    <span className="text-white/80">{story.so}</span>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mod.core_fields && mod.core_fields.length > 0 && (
                    <div>
                      <div className="text-xs text-white/50 font-medium uppercase tracking-wider mb-2">
                        Core Fields
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mod.core_fields.map((f) => (
                          <span
                            key={f}
                            className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#00d4aa]/8 border border-[#00d4aa]/15 text-[#00d4aa]/80"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {mod.permissions && Object.keys(mod.permissions).length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Shield className="w-3.5 h-3.5 text-white/30" />
                        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                          Permissions
                        </span>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(mod.permissions).map(([role, perms]) => (
                          <div key={role} className="flex items-center gap-3">
                            <span className="text-xs text-white/50 w-32 truncate">{role}</span>
                            <span className="text-xs text-white/70">{perms}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
