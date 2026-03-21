"use client";
import { useProjectStore } from "@/stores/project-store";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const { currentProject } = useProjectStore();
  const pathname = usePathname();

  const crumbs: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];
  if (currentProject) {
    crumbs.push({
      label: currentProject.project_title,
      href: `/projects/${currentProject.name}/overview`,
    });
    const tab = pathname.split("/").pop();
    if (tab && !["overview", currentProject.name].includes(tab)) {
      const tabLabels: Record<string, string> = {
        "data-model": "Data Model",
        modules: "Module Specs",
        dashboards: "Dashboards",
        "sprint-plan": "Sprint Plan",
        chat: "AI Chat",
        checklists: "Checklists",
        export: "Export",
      };
      if (tabLabels[tab]) {
        crumbs.push({ label: tabLabels[tab], href: pathname });
      }
    }
  }

  return (
    <div className="h-14 border-b border-white/6 flex items-center px-6 gap-2 flex-shrink-0">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/20" />}
          {i === crumbs.length - 1 ? (
            <span className="text-sm text-white/70">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}

      {currentProject && (
        <div className="ml-auto">
          <Badge
            variant="outline"
            className={`text-xs border-white/10 ${
              currentProject.generation_status === "done"
                ? "text-[#00d4aa] border-[#00d4aa]/20"
                : currentProject.generation_status === "generating"
                  ? "text-[#b8ff4f] border-[#b8ff4f]/20"
                  : "text-white/40"
            }`}
          >
            {currentProject.generation_status === "done"
              ? "Blueprint ready"
              : currentProject.generation_status === "generating"
                ? "Generating..."
                : "Draft"}
          </Badge>
        </div>
      )}
    </div>
  );
}
