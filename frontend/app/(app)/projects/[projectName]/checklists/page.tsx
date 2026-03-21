"use client";
import { useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { CheckSquare, Square } from "lucide-react";

const GO_LIVE_CHECKLIST = [
  {
    category: "Data Model",
    color: "#00d4aa",
    items: [
      "All entities reviewed and approved by the programme team",
      "Field names use Title Case and follow naming conventions",
      "Required fields are marked and validated",
      "Relationships between entities are correctly mapped",
      "Lookup tables are populated with correct values",
      "ID formats confirmed (e.g., ORG-0001, PRJ-0001)",
    ],
  },
  {
    category: "Module Build",
    color: "#b8ff4f",
    items: [
      "All Phase 1 modules are built and tested",
      "Permissions configured for each role",
      "Workflows and automations are functioning",
      "Data entry forms are user-tested with field staff",
      "Print templates created where needed",
    ],
  },
  {
    category: "Dashboards",
    color: "#7c3aed",
    items: [
      "All dashboards are accessible to the correct roles",
      "KPI calculations verified against sample data",
      "Date range filters working correctly",
      "Charts rendering on mobile devices",
      "Dashboard shared with stakeholders for review",
    ],
  },
  {
    category: "Data Migration",
    color: "#00d4aa",
    items: [
      "Historical data cleaned and mapped to new schema",
      "Data migration tested on staging environment",
      "Duplicate records identified and resolved",
      "Data migration sign-off received from programme team",
    ],
  },
  {
    category: "Training & Go-Live",
    color: "#b8ff4f",
    items: [
      "Admin user trained on system configuration",
      "Field staff trained on data entry",
      "User manual distributed to all users",
      "Support escalation process documented",
      "Go-live date confirmed with all stakeholders",
      "Post-go-live hyper-care period scheduled (30-45 days)",
    ],
  },
];

export default function ChecklistsPage() {
  const { currentProject } = useProjectStore();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  if (!currentProject) return null;

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const totalItems = GO_LIVE_CHECKLIST.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );
  const doneItems = checked.size;
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Go-Live Checklists</h1>
        <p className="text-white/50 text-sm">
          Track your implementation readiness for {currentProject.project_title}
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-[#0f1a17] border border-white/8 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Implementation Readiness</span>
          <span className="text-sm font-bold text-[#00d4aa]">{pct}%</span>
        </div>
        <div className="h-2 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #00d4aa, #b8ff4f)",
            }}
          />
        </div>
        <div className="text-xs text-white/30 mt-1.5">
          {doneItems} of {totalItems} items completed
        </div>
      </div>

      {/* Checklists */}
      <div className="space-y-6">
        {GO_LIVE_CHECKLIST.map((cat) => {
          const catDone = cat.items.filter((_, i) =>
            checked.has(`${cat.category}-${i}`),
          ).length;
          return (
            <div
              key={cat.category}
              className="bg-[#0f1a17] border border-white/8 rounded-xl overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-white/6 flex items-center justify-between">
                <span
                  className="text-sm font-semibold"
                  style={{ color: cat.color }}
                >
                  {cat.category}
                </span>
                <span className="text-xs text-white/30">
                  {catDone}/{cat.items.length}
                </span>
              </div>
              <div className="p-3 space-y-1">
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  const isDone = checked.has(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggle(key)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/3 transition-colors text-left"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isDone ? (
                          <CheckSquare
                            className="w-4 h-4"
                            style={{ color: cat.color }}
                          />
                        ) : (
                          <Square className="w-4 h-4 text-white/20" />
                        )}
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          isDone ? "text-white/35 line-through" : "text-white/70"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
