"use client";
import { useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { getToken } from "@/lib/auth";
import { Download, FileText, Table, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EXPORT_OPTIONS = [
  {
    id: "word",
    label: "Word Document",
    description: "Complete MIS Blueprint as a formatted .docx file",
    icon: FileText,
    color: "#00d4aa",
    ext: "docx",
  },
  {
    id: "excel",
    label: "Excel Workbook",
    description: "Data model and module specs as structured spreadsheets",
    icon: Table,
    color: "#b8ff4f",
    ext: "xlsx",
  },
  {
    id: "pdf",
    label: "PDF Report",
    description: "Print-ready PDF version of your blueprint",
    icon: FileSpreadsheet,
    color: "#7c3aed",
    ext: "pdf",
  },
];

export default function ExportPage() {
  const { currentProject } = useProjectStore();
  const [exporting, setExporting] = useState<string | null>(null);

  if (!currentProject) return null;

  async function handleExport(exportId: string, ext: string) {
    const token = getToken();
    if (!token) return;

    setExporting(exportId);
    try {
      const res = await fetch(
        `/api/export/${exportId}?project_name=${currentProject!.name}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentProject!.project_title.replace(/\s+/g, "_")}_Blueprint.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  const isReady = currentProject.generation_status === "done";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Export Blueprint</h1>
        <p className="text-white/50 text-sm">
          Download your complete MIS Blueprint for {currentProject.project_title}
        </p>
      </div>

      {!isReady && (
        <div className="bg-[#b8ff4f]/10 border border-[#b8ff4f]/20 rounded-xl p-4 mb-6 text-sm text-[#b8ff4f]">
          Blueprint generation is not complete yet. Export will be available once
          generation is done.
        </div>
      )}

      <div className="space-y-3">
        {EXPORT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isLoading = exporting === opt.id;
          return (
            <div
              key={opt.id}
              className="bg-[#0f1a17] border border-white/8 rounded-xl p-5 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: opt.color + "15",
                  border: `1px solid ${opt.color}25`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: opt.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{opt.label}</div>
                <div className="text-xs text-white/40 mt-0.5">
                  {opt.description}
                </div>
              </div>
              <Button
                onClick={() => handleExport(opt.id, opt.ext)}
                disabled={!isReady || isLoading}
                className="flex-shrink-0 gap-2 bg-white/8 text-white hover:bg-white/15 border border-white/10"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-[#0f1a17] border border-white/6 rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-2">What&apos;s included in the export?</h3>
        <ul className="space-y-2 text-sm text-white/50">
          <li className="flex gap-2">
            <span className="text-[#00d4aa]">·</span>
            Theory of Change map with activities, outputs, outcomes, and impact
          </li>
          <li className="flex gap-2">
            <span className="text-[#00d4aa]">·</span>
            Complete data model with all entities, fields, and relationships
          </li>
          <li className="flex gap-2">
            <span className="text-[#b8ff4f]">·</span>
            Module specifications with user stories, workflows, and permissions
          </li>
          <li className="flex gap-2">
            <span className="text-[#7c3aed]">·</span>
            Dashboard plan with KPIs, chart types, and audience mapping
          </li>
          <li className="flex gap-2">
            <span className="text-[#7c3aed]">·</span>
            Sprint plan with goals, tasks, and testing criteria per sprint
          </li>
        </ul>
      </div>
    </div>
  );
}
