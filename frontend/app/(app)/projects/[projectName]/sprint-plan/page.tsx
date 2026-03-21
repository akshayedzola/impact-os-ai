"use client";
import { useProjectStore } from "@/stores/project-store";
import { Calendar, CheckSquare, Flag } from "lucide-react";

interface Sprint {
  sprint_number?: number;
  number?: number;
  goal?: string;
  duration?: string | number;
  modules?: string[];
  features?: string[];
  tasks?: string[];
  testing_criteria?: string[];
  dependencies?: string[];
}

interface SprintPlan {
  sprints: Sprint[];
  total_weeks?: number;
  go_live_week?: number;
}

export default function SprintPlanPage() {
  const { currentProject } = useProjectStore();

  if (!currentProject) return null;

  const plan = currentProject.sprint_plan as SprintPlan | null;

  if (!plan || !plan.sprints) {
    return (
      <div className="text-center py-20">
        <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">Sprint plan not yet generated.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Sprint Plan</h1>
        <p className="text-white/50 text-sm">
          <span className="text-[#7c3aed]">P — Power with AI:</span>{" "}
          {plan.sprints.length} sprints
          {plan.total_weeks ? ` · ${plan.total_weeks} weeks total` : ""}
          {plan.go_live_week ? ` · Go-live at week ${plan.go_live_week}` : ""}
        </p>
      </div>

      {/* Summary bar */}
      {plan.total_weeks && (
        <div className="bg-[#0f1a17] border border-white/8 rounded-xl p-4 mb-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm font-medium">
              {plan.total_weeks} weeks
            </span>
            <span className="text-xs text-white/40">total duration</span>
          </div>
          {plan.go_live_week && (
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#00d4aa]" />
              <span className="text-sm font-medium">Week {plan.go_live_week}</span>
              <span className="text-xs text-white/40">go-live</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#b8ff4f]" />
            <span className="text-sm font-medium">{plan.sprints.length}</span>
            <span className="text-xs text-white/40">sprints</span>
          </div>
        </div>
      )}

      {/* Sprints timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/8" />

        <div className="space-y-4">
          {plan.sprints.map((sprint, i) => {
            const sprintNum = sprint.sprint_number ?? sprint.number ?? i + 1;
            const items = [
              ...(sprint.modules || []),
              ...(sprint.features || []),
              ...(sprint.tasks || []),
            ];
            return (
              <div key={i} className="relative pl-14">
                {/* Sprint number bubble */}
                <div className="absolute left-0 w-10 h-10 rounded-full bg-[#0f1a17] border border-white/15 flex items-center justify-center text-xs font-bold text-white/60">
                  S{sprintNum}
                </div>

                <div className="bg-[#0f1a17] border border-white/8 rounded-xl p-4 hover:border-white/12 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">
                        Sprint {sprintNum}
                      </div>
                      {sprint.duration && (
                        <div className="text-xs text-white/40 mt-0.5">
                          {typeof sprint.duration === "number"
                            ? `${sprint.duration} week${sprint.duration > 1 ? "s" : ""}`
                            : sprint.duration}
                        </div>
                      )}
                    </div>
                    {plan.go_live_week && sprintNum === plan.sprints.length && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#00d4aa] bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full px-2.5 py-1">
                        <Flag className="w-3 h-3" />
                        Go-Live
                      </div>
                    )}
                  </div>

                  {sprint.goal && (
                    <p className="text-sm text-white/60 mb-3 leading-relaxed">
                      {sprint.goal}
                    </p>
                  )}

                  {items.length > 0 && (
                    <div className="space-y-1.5">
                      {items.map((item, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-2 text-xs text-white/50"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]/50 mt-1.5 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {sprint.testing_criteria && sprint.testing_criteria.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/6">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">
                        Testing Criteria
                      </div>
                      <div className="space-y-1">
                        {sprint.testing_criteria.map((t, j) => (
                          <div
                            key={j}
                            className="flex items-start gap-2 text-xs text-white/40"
                          >
                            <CheckSquare className="w-3 h-3 text-[#b8ff4f]/50 mt-0.5 flex-shrink-0" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
