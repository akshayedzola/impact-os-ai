import { NextRequest, NextResponse } from 'next/server';

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');
  const { searchParams } = new URL(req.url);
  const projectName = searchParams.get('project_name');

  if (!projectName) {
    return NextResponse.json({ error: 'project_name required' }, { status: 400 });
  }

  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.projects.get_project?project_name=${projectName}`,
    { headers: { Authorization: token || '' } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const data = await res.json();
  // TODO: Full PDF rendering with @react-pdf/renderer
  return NextResponse.json({
    project_name: projectName,
    status: 'pdf_pending',
    message: 'PDF export coming in Phase 2',
    project: data.message,
  });
}
