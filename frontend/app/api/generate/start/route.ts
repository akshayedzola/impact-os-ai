import { NextRequest, NextResponse } from 'next/server';

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');
  const body = await req.json();
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.generate.start`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token || '' },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  return NextResponse.json(data.message ?? data, { status: res.status });
}
