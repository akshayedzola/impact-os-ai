import { NextRequest, NextResponse } from "next/server";

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || "http://localhost:8000";
const MOCK_MODE = process.env.MOCK_MODE === "true";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (MOCK_MODE) {
    const { createUser } = await import("@/lib/mock/db");
    const { signToken } = await import("@/lib/mock/jwt");

    try {
      const user = createUser(
        body.email,
        body.password,
        body.fullName || body.full_name || body.email.split("@")[0],
        body.organisationName || body.organisation_name || "My Organisation",
      );

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
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Registration failed" },
        { status: 400 },
      );
    }
  }

  // Real Frappe path
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.auth.register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data.exception || "Registration failed" },
      { status: res.status },
    );
  }
  return NextResponse.json(data.message);
}
