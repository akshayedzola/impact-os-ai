import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || "http://localhost:8000";
const MOCK_MODE = process.env.MOCK_MODE === "true";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (MOCK_MODE) {
    const { extractToken, verifyToken } = await import("@/lib/mock/jwt");
    const { getUserById } = await import("@/lib/mock/db");

    const rawToken = extractToken(authHeader);
    if (!rawToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = verifyToken(rawToken);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Refresh from DB in case plan/projectsUsed changed
    const user = getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      organisationName: user.organisationName,
      plan: user.plan,
      projectsUsed: user.projectsUsed,
    });
  }

  // Real Frappe path
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.auth.me`,
    {
      headers: {
        "X-IOS-Token": authHeader?.replace("Bearer ", "") || "",
        "Content-Type": "application/json",
      },
    },
  );
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(data.message);
}
