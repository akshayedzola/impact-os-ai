"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";
import { frappeCall } from "@/lib/frappe/client";
import { getToken } from "@/lib/auth";
import GeneratingState from "@/components/project/GeneratingState";
import { useRouter } from "next/navigation";

function parseProject(data: any) {
  return {
    ...data,
    theory_of_change: data.theory_of_change
      ? tryParse(data.theory_of_change)
      : null,
    data_model: data.data_model ? tryParse(data.data_model) : null,
    module_specs: data.module_specs ? tryParse(data.module_specs) : null,
    dashboard_plan: data.dashboard_plan ? tryParse(data.dashboard_plan) : null,
    sprint_plan: data.sprint_plan ? tryParse(data.sprint_plan) : null,
    is_public: !!data.is_public,
  };
}

function tryParse(value: string | object) {
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectName } = useParams() as { projectName: string };
  const { currentProject, setCurrentProject } = useProjectStore();
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token || !projectName) return;

    frappeCall("projects", "get_project", { project_name: projectName }, "GET", token)
      .then((data: any) => setCurrentProject(parseProject(data)))
      .catch(() => router.push("/dashboard"));
  }, [projectName, setCurrentProject, router]);

  if (!currentProject || currentProject.name !== projectName) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-[#00d4aa] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (currentProject.generation_status === "generating") {
    return (
      <GeneratingState
        projectName={projectName}
        onComplete={() => {
          const token = getToken();
          if (!token) return;
          frappeCall(
            "projects",
            "get_project",
            { project_name: projectName },
            "GET",
            token,
          ).then((data: any) => setCurrentProject(parseProject(data)));
        }}
      />
    );
  }

  return <>{children}</>;
}
