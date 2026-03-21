"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/project/ProjectCard";
import { frappeCall } from "@/lib/frappe/client";
import { getToken } from "@/lib/auth";

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    frappeCall<{ projects: any[] }>(
      "projects",
      "list_projects",
      { page: "1", limit: "20" },
      "GET",
      token,
    )
      .then((data) => setProjects(data.projects || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-white/50 text-sm mt-0.5">Your MIS blueprint projects</p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-[#00d4aa] text-[#080e0c] hover:bg-[#00d4aa]/90 font-semibold gap-2">
            <Plus className="w-4 h-4" />
            New Blueprint
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#0f1a17] border border-white/8 rounded-xl p-5 animate-pulse h-40"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-white/30 text-lg mb-3">No projects yet</div>
          <p className="text-white/40 text-sm mb-6">
            Create your first MIS blueprint using the MAP Framework
          </p>
          <Link href="/projects/new">
            <Button className="bg-[#00d4aa] text-[#080e0c] hover:bg-[#00d4aa]/90 font-semibold">
              Create your first blueprint
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
