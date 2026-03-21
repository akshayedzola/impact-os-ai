import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

const SECTOR_LABELS: Record<string, string> = {
  livelihoods: "Livelihoods",
  education: "Education",
  health: "Health",
  environment: "Environment",
  governance: "Governance",
  fundraising: "Fundraising",
  other: "Other",
};

const STATUS_COLORS: Record<string, string> = {
  done: "text-[#00d4aa] border-[#00d4aa]/20",
  generating: "text-[#b8ff4f] border-[#b8ff4f]/20 animate-pulse",
  failed: "text-red-400 border-red-400/20",
  idle: "text-white/40 border-white/10",
};

export default function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/projects/${project.name}/overview`}>
      <div className="bg-[#0f1a17] border border-white/8 rounded-xl p-5 hover:border-[#00d4aa]/20 hover:shadow-[0_0_20px_rgba(0,212,170,0.05)] transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate group-hover:text-[#00d4aa] transition-colors">
              {project.project_title}
            </h3>
            {project.sector && (
              <span className="text-xs text-white/40 mt-0.5 block">
                {SECTOR_LABELS[project.sector] || project.sector}
              </span>
            )}
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] ml-2 flex-shrink-0 ${
              STATUS_COLORS[project.generation_status] || STATUS_COLORS.idle
            }`}
          >
            {project.generation_status === "done"
              ? "Ready"
              : project.generation_status === "generating"
                ? "Generating"
                : "Draft"}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 text-[10px] text-white/30">
            <Calendar className="w-3 h-3" />
            {new Date(project.modified || project.creation).toLocaleDateString(
              "en-GB",
              { day: "numeric", month: "short", year: "numeric" },
            )}
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#00d4aa] transition-colors" />
        </div>
      </div>
    </Link>
  );
}
