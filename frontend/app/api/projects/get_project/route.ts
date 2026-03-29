import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || "http://localhost:8000";
const MOCK_MODE = process.env.MOCK_MODE === "true";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const projectName = searchParams.get("project_name");

  if (!projectName) {
    return NextResponse.json({ error: "project_name required" }, { status: 400 });
  }

  if (MOCK_MODE) {
    const { getProject } = await import("@/lib/mock/db");
    const project = getProject(projectName);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    // Map mock DB fields to the shape the frontend Project store expects
    return NextResponse.json({
      ...project,
      name: project.project_name,                    // store uses `name`
      generation_status: project.status as "idle" | "generating" | "done" | "failed",
      is_public: false,
      creation: project.createdAt,
      modified: project.updatedAt,
    });
  }

  // Real Frappe path
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.projects.get_project?project_name=${projectName}`,
    { headers: { "X-IOS-Token": authHeader?.replace("Bearer ", "") || "" } },
  );
  const data = await res.json();
  return NextResponse.json(data.message ?? data, { status: res.status });
}
