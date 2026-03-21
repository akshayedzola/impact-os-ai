"use client";
import { useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { BarChart3, Users, Filter } from "lucide-react";

interface KPI {
  name: string;
  formula?: string;
  description?: string;
}

interface Chart {
  type: string;
  title: string;
  description?: string;
}

interface Dashboard {
  name: string;
  audience?: string;
  purpose?: string;
  key_questions?: string[];
  kpis?: (KPI | string)[];
  charts?: (Chart | string)[];
  filters?: string[];
}

interface DashboardPlan {
  dashboards: Dashboard[];
}

export default function DashboardsPage() {
  const { currentProject } = useProjectStore();
  const [selected, setSelected] = useState(0);

  if (!currentProject) return null;

  const plan = currentProject.dashboard_plan as DashboardPlan | null;

  if (!plan || !plan.dashboards) {
    return (
      <div className="text-center py-20">
        <BarChart3 className="w-12 h-12 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">Dashboard plan not yet generated.</p>
      </div>
    );
  }

  const dashboard = plan.dashboards[selected];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard Plan</h1>
        <p className="text-white/50 text-sm">
          <span className="text-[#7c3aed]">P — Power with AI:</span>{" "}
          {plan.dashboards.length} dashboards planned for{" "}
          {currentProject.project_title}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {plan.dashboards.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                i === selected
                  ? "bg-[#7c3aed]/15 text-[#7c3aed] border border-[#7c3aed]/25"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="font-medium truncate">{d.name}</div>
              {d.audience && (
                <div className="text-[10px] text-white/30 mt-0.5 truncate">
                  {d.audience}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard detail */}
        {dashboard && (
          <div className="flex-1 min-w-0 space-y-5">
            <div className="bg-[#0f1a17] border border-white/8 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-[#7c3aed]" />
                </div>
                <div>
                  <h2 className="font-semibold">{dashboard.name}</h2>
                  {dashboard.audience && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Users className="w-3 h-3 text-white/30" />
                      <span className="text-xs text-white/40">
                        {dashboard.audience}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {dashboard.purpose && (
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {dashboard.purpose}
                </p>
              )}

              {dashboard.key_questions && dashboard.key_questions.length > 0 && (
                <div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-2">
                    Key Questions Answered
                  </div>
                  <ul className="space-y-1">
                    {dashboard.key_questions.map((q, i) => (
                      <li key={i} className="text-sm text-white/60 flex gap-2">
                        <span className="text-[#7c3aed] flex-shrink-0">?</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* KPIs */}
            {dashboard.kpis && dashboard.kpis.length > 0 && (
              <div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">
                  KPI Cards
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dashboard.kpis.map((kpi, i) => {
                    const kpiObj = typeof kpi === "string" ? { name: kpi } : kpi;
                    return (
                      <div
                        key={i}
                        className="bg-[#0f1a17] border border-white/8 rounded-xl p-4"
                      >
                        <div className="text-sm font-medium mb-1">{kpiObj.name}</div>
                        {kpiObj.formula && (
                          <div className="text-[10px] font-mono text-[#00d4aa]/60 bg-[#00d4aa]/5 rounded px-2 py-1 mt-1">
                            {kpiObj.formula}
                          </div>
                        )}
                        {kpiObj.description && (
                          <div className="text-[10px] text-white/30 mt-1">
                            {kpiObj.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Charts */}
            {dashboard.charts && dashboard.charts.length > 0 && (
              <div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">
                  Charts
                </div>
                <div className="space-y-2">
                  {dashboard.charts.map((chart, i) => {
                    const chartObj =
                      typeof chart === "string" ? { title: chart, type: "" } : chart;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-[#0f1a17] border border-white/6 rounded-lg px-4 py-3"
                      >
                        <div className="w-8 h-8 rounded-md bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-3.5 h-3.5 text-[#7c3aed]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm">{chartObj.title}</div>
                          {chartObj.description && (
                            <div className="text-xs text-white/40 mt-0.5">
                              {chartObj.description}
                            </div>
                          )}
                        </div>
                        {chartObj.type && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 flex-shrink-0">
                            {chartObj.type}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filters */}
            {dashboard.filters && dashboard.filters.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Filter className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
                    Filters Available
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dashboard.filters.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
