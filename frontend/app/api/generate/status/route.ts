import { NextRequest, NextResponse } from 'next/server';

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');
  const { searchParams } = new URL(req.url);
  const projectName = searchParams.get('project_name');
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.generate.get_status?project_name=${projectName}`,
    { headers: { Authorization: token || '' } }
  );
  const data = await res.json();
  return NextResponse.json(data.message ?? data, { status: res.status });
}
