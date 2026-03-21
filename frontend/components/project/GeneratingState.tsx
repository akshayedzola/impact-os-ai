"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Circle, Loader2, Zap } from "lucide-react";
import { useProjectStore } from "@/stores/project-store";
import { getToken } from "@/lib/auth";

const STEPS = [
  { key: "has_toc", label: "Mapping Theory of Change", phase: "M — Model" },
  { key: "has_data_model", label: "Building Data Model", phase: "M — Model" },
  { key: "has_modules", label: "Designing Module Specs", phase: "A — Align" },
  { key: "has_dashboards", label: "Planning Dashboards", phase: "P — Power" },
  { key: "has_sprint", label: "Creating Sprint Plan", phase: "P — Power" },
];

const PHASE_COLORS: Record<string, string> = {
  "M — Model": "#00d4aa",
  "A — Align": "#b8ff4f",
  "P — Power": "#7c3aed",
};

export default function GeneratingState({
  projectName,
  onComplete,
}: {
  projectName: string;
  onComplete: () => void;
}) {
  const [stepStatus, setStepStatus] = useState<Record<string, boolean>>({});
  const [progressText, setProgressText] = useState("Starting blueprint generation...");
  const { updateGeneration } = useProjectStore();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/generate/status?project_name=${projectName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();

        setStepStatus(data);
        setProgressText(data.progress_text || "Generating...");
        updateGeneration(data.progress_text || "");

        if (data.status === "done") {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
        } else if (data.status === "failed") {
          clearInterval(interval);
        }
      } catch {
        // ignore transient errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [projectName, onComplete, updateGeneration]);

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {/* Animated icon */}
        <div className="w-16 h-16 rounded-2xl ios-gradient flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-[#080e0c] animate-pulse" />
        </div>

        <h2 className="text-xl font-bold mb-1">Generating your MIS Blueprint</h2>
        <p className="text-white/50 text-sm mb-8">{progressText}</p>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {STEPS.map((step, i) => {
            const done = stepStatus[step.key];
            const isNext =
              !done && Object.values(stepStatus).filter(Boolean).length === i;
            const color = PHASE_COLORS[step.phase];
            return (
              <div
                key={step.key}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0f1a17] border border-white/6"
              >
                <div className="flex-shrink-0">
                  {done ? (
                    <CheckCircle className="w-4 h-4" style={{ color }} />
                  ) : isNext ? (
                    <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium">{step.label}</div>
                  <div className="text-[10px]" style={{ color: color + "99" }}>
                    {step.phase}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
