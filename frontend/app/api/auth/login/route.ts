import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || "http://localhost:8000";
const MOCK_MODE = process.env.MOCK_MODE === "true";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (MOCK_MODE) {
    const { createUser, verifyUser } = await import("@/lib/mock/db");
    const { signToken } = await import("@/lib/mock/jwt");

    // Auto-create user on first login if they don't exist (dev convenience)
    let user = verifyUser(body.email, body.password);
    if (!user) {
      try {
        user = createUser(
          body.email,
          body.password,
          body.fullName || body.email.split("@")[0],
          body.organisationName || "My Organisation",
        );
      } catch {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const token = signToken({
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      organisationName: user.organisationName,
      plan: user.plan,
      projectsUsed: user.projectsUsed,
    });

    return NextResponse.json({
      token,
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        organisationName: user.organisationName,
        plan: user.plan,
        projectsUsed: user.projectsUsed,
      },
    });
  }

  // Real Frappe path
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.auth.login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data.exception || data._server_messages || "Login failed" },
      { status: res.status },
    );
  }
  return NextResponse.json(data.message);
}
