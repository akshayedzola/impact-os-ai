import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || "http://localhost:8000";
const MOCK_MODE = process.env.MOCK_MODE === "true";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (MOCK_MODE) {
    const { extractToken, verifyToken } = await import("@/lib/mock/jwt");
    const { listProjects } = await import("@/lib/mock/db");

    const rawToken = extractToken(authHeader);
    const payload = rawToken ? verifyToken(rawToken) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = listProjects(payload.userId);
    return NextResponse.json(projects);
  }

  // Real Frappe path
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.projects.list_projects`,
    { headers: { "X-IOS-Token": authHeader?.replace("Bearer ", "") || "" } },
  );
  const data = await res.json();
  return NextResponse.json(data.message ?? data, { status: res.status });
}
