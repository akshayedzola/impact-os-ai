import { NextRequest, NextResponse } from 'next/server';

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.auth.register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data.exception || 'Registration failed' },
      { status: res.status }
    );
  }
  return NextResponse.json(data.message);
}
