import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || "http://localhost:8000";
const MOCK_MODE = process.env.MOCK_MODE === "true";

// 5 sequential OpenAI calls — allow up to 5 mins
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const body = await req.json();

  if (MOCK_MODE) {
    const { extractToken, verifyToken } = await import("@/lib/mock/jwt");
    const { getProject, updateProject } = await import("@/lib/mock/db");

    const rawToken = extractToken(authHeader);
    const payload = rawToken ? verifyToken(rawToken) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectName = body.project_name;
    const project = getProject(projectName);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Mark as generating
    updateProject(projectName, { status: "generating", generation_progress: 5 });

    const ctx = `Title: ${project.project_title}
Description: ${project.description}
Sector: ${project.sector}
Organisation Type: ${project.organisation_type || "NGO"}
Country: ${project.country || "not specified"}
Team Size: ${project.team_size || "not specified"}`;

    async function gen(prompt: string): Promise<string> {
      const { text } = await generateText({ model: openai("gpt-4o"), prompt, temperature: 0.7 });
      const m = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      return m ? m[0] : text;
    }

    try {
      // 1 — Theory of Change (20%)
      const toc = await gen(`You are an expert nonprofit MIS consultant (MAP Framework). Respond with valid JSON only — no markdown.

Generate a Theory of Change for:
${ctx}

Return exactly:
{"problem_statement":"...","target_population":"...","activities":["...","...","..."],"outputs":["...","...","..."],"outcomes":["...","...","..."],"impact":"...","assumptions":["...","..."],"indicators":["...","...","..."]}`);
      updateProject(projectName, { theory_of_change: toc, generation_progress: 20 });

      // 2 — Data Model (40%)
      const dm = await gen(`You are an expert nonprofit MIS consultant (MAP Framework). Respond with valid JSON only — no markdown.

Design a data model for:
${ctx}

Return exactly:
{"entities":[{"name":"EntityName","label":"Human Label","description":"...","fields":[{"name":"field","label":"Label","type":"Data","required":true}]}]}

Include 5-7 entities relevant to ${project.sector} (e.g. Beneficiary, Session, Indicator, Report).`);
      updateProject(projectName, { data_model: dm, generation_progress: 40 });

      // 3 — Module Specs (60%)
      const mods = await gen(`You are an expert nonprofit MIS consultant (MAP Framework). Respond with valid JSON only — no markdown.

Design module specifications for:
${ctx}

Return exactly:
{"modules":[{"name":"ModuleName","label":"Label","description":"...","user_stories":["As a field officer I want to..."],"key_fields":["field1","field2"],"permissions":{"field_officer":"read/write","manager":"read/write/delete"}}]}

Design 4-6 modules for ${project.sector}.`);
      updateProject(projectName, { module_specs: mods, generation_progress: 60 });

      // 4 — Dashboards (80%)
      const dash = await gen(`You are an expert nonprofit MIS consultant (MAP Framework). Respond with valid JSON only — no markdown.

Design dashboards for:
${ctx}

Return exactly:
{"dashboards":[{"name":"DashboardName","label":"Label","target_user":"Programme Manager","kpis":[{"metric":"KPI Name","description":"...","visualization":"number"}],"charts":[{"title":"Chart Title","type":"bar","data_source":"..."}],"filters":["filter1"]}]}

Design 3-4 dashboards for different roles.`);
      updateProject(projectName, { dashboard_plan: dash, generation_progress: 80 });

      // 5 — Sprint Plan (95%)
      const sprint = await gen(`You are an expert nonprofit MIS consultant (MAP Framework). Respond with valid JSON only — no markdown.

Create a 12-week implementation sprint plan for:
${ctx}

Return exactly:
{"total_weeks":12,"sprints":[{"sprint_number":1,"weeks":"1-2","theme":"Theme","goals":["goal1","goal2"],"deliverables":["deliverable1"],"tasks":[{"task":"Task description","owner":"developer","days":2}]}]}

Plan 6 sprints of 2 weeks each.`);
      updateProject(projectName, { sprint_plan: sprint, generation_progress: 95 });

      updateProject(projectName, { status: "completed", generation_progress: 100 });

      return NextResponse.json({
        job_id: `mock-${Date.now()}`,
        project_name: projectName,
        status: "completed",
        message: "Blueprint generated successfully",
      });
    } catch (err) {
      updateProject(projectName, { status: "failed", generation_progress: 0 });
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Generation failed" },
        { status: 500 },
      );
    }
  }

  // Real Frappe path
  const res = await fetch(
    `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.generate.start`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-IOS-Token": authHeader?.replace("Bearer ", "") || "" },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json();
  return NextResponse.json(data.message ?? data, { status: res.status });
}
