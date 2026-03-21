"use client";
import { useProjectStore } from "@/stores/project-store";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

interface PhaseSection {
  phase: string;
  phaseLabel: string;
  color: string;
  items: {
    label: string;
    description: string;
    href: string;
    dataKey: string;
  }[];
}

export default function ProjectOverviewPage() {
  const { currentProject } = useProjectStore();
  const { projectName } = useParams() as { projectName: string };

  if (!currentProject) return null;

  const base = `/projects/${projectName}`;

  const phases: PhaseSection[] = [
    {
      phase: "M",
      phaseLabel: "Model",
      color: "#00d4aa",
      items: [
        {
          label: "Data Model",
          description: "Entities, fields, relationships & validation rules",
          href: `${base}/data-model`,
          dataKey: "data_model",
        },
      ],
    },
    {
      phase: "A",
      phaseLabel: "Align",
      color: "#b8ff4f",
      items: [
        {
          label: "Module Specifications",
          description: "User stories, workflows & permissions per module",
          href: `${base}/modules`,
          dataKey: "module_specs",
        },
      ],
    },
    {
      phase: "P",
      phaseLabel: "Power with AI",
      color: "#7c3aed",
      items: [
        {
          label: "Dashboard Plan",
          description: "KPIs, charts & audience for each dashboard",
          href: `${base}/dashboards`,
          dataKey: "dashboard_plan",
        },
        {
          label: "Sprint Plan",
          description: "Week-by-week implementation roadmap",
          href: `${base}/sprint-plan`,
          dataKey: "sprint_plan",
        },
      ],
    },
  ];

  return (
    <div>
      {/* Project header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">{currentProject.project_title}</h1>
        <p className="text-white/50 text-sm">
          {currentProject.sector && (
            <span className="capitalize">{currentProject.sector} · </span>
          )}
          {currentProject.country && <span>{currentProject.country} · </span>}
          MIS Blueprint
        </p>
        {currentProject.description && (
          <p className="text-white/40 text-sm mt-3 max-w-2xl leading-relaxed">
            {currentProject.description}
          </p>
        )}
      </div>

      {/* MAP phases */}
      <div className="space-y-6">
        {phases.map((section) => (
          <div key={section.phase}>
            {/* Phase header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#080e0c]"
                style={{ backgroundColor: section.color }}
              >
                {section.phase}
              </div>
              <span className="font-semibold text-sm" style={{ color: section.color }}>
                {section.phase} — {section.phaseLabel}
              </span>
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
              {section.items.map((item) => {
                const hasData = !!(currentProject as any)[item.dataKey];
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="bg-[#0f1a17] border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all group cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {hasData ? (
                            <CheckCircle
                              className="w-4 h-4 flex-shrink-0"
                              style={{ color: section.color }}
                            />
                          ) : (
                            <Circle className="w-4 h-4 text-white/20 flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                      </div>
                      <p className="text-xs text-white/40 pl-6">{item.description}</p>
                      {hasData && (
                        <div
                          className="mt-2 pl-6 text-[10px] font-medium"
                          style={{ color: section.color + "99" }}
                        >
                          Generated ✓
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Chat CTA */}
      <div className="mt-8 bg-[#0f1a17] border border-[#7c3aed]/20 rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm mb-0.5">AI Chat</div>
          <p className="text-xs text-white/40">
            Ask questions about your blueprint, refine sections, or explore ideas with ImpactOS AI.
          </p>
        </div>
        <Link href={`${base}/chat`}>
          <div className="flex-shrink-0 ml-4 px-4 py-2 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#7c3aed] text-sm font-medium hover:bg-[#7c3aed]/30 transition-colors">
            Open Chat →
          </div>
        </Link>
      </div>
    </div>
  );
}
