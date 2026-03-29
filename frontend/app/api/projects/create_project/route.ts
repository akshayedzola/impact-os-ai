import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || "http://localhost:8000";
const MOCK_MODE = process.env.MOCK_MODE === "true";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const body = await req.json();

  if (MOCK_MODE) {
    const { extractToken, verifyToken } = await import("@/lib/mock/jwt");
    const { createProject } = await import("@/lib/mock/db");

    const rawToken = extractToken(authHeader);
    const payload = rawToken ? verifyToken(rawToken) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = createProject(body, payload.userId);
    return NextResponse.json(project);
  }

  // Real Frappe path
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.projects.create_project`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-IOS-Token": authHeader?.replace("Bearer ", "") || "",
      },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json();
  return NextResponse.json(data.message ?? data, { status: res.status });
}
