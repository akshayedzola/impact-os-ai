import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest } from 'next/server';
import { IMPACTOS_SYSTEM_PROMPT } from '@/lib/openai/system-prompt';
import { buildProjectContext } from '@/lib/openai/chat-context-builder';
import type { IProject } from '@/types/project';

const FRAPPE_BASE = process.env.FRAPPE_BASE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');
  const body = await req.json();
  const messages = body.messages ?? [];
  const project: IProject = body.project;

  const projectContext = buildProjectContext(project);
  const systemPrompt = `${IMPACTOS_SYSTEM_PROMPT}\n\n## CURRENT PROJECT CONTEXT\n${projectContext}`;

  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    temperature: 0.7,
    onFinish: async ({ text }) => {
      if (!token || !project?.name) return;
      try {
        // Persist assistant message to Frappe
        await fetch(
          `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.chat.save_message`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: token },
            body: JSON.stringify({ project_name: project.name, role: 'assistant', content: text }),
          }
        );

        // Detect and save structured JSON output
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[1]);
            const section = detectSection(parsed);
            if (section) {
              await fetch(
                `${FRAPPE_BASE}/api/method/impact_os_ai.impact_os_ai.api.chat.update_project_section`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: token },
                  body: JSON.stringify({ project_name: project.name, section, data: jsonMatch[1] }),
                }
              );
            }
          } catch {
            // Not JSON, skip
          }
        }
      } catch {
        // Non-blocking
      }
    },
  });

  return result.toUIMessageStreamResponse();
}

function detectSection(parsed: Record<string, unknown>): string | null {
  if ('entities' in parsed) return 'data_model';
  if ('modules' in parsed) return 'module_specs';
  if ('dashboards' in parsed) return 'dashboard_plan';
  if ('sprints' in parsed) return 'sprint_plan';
  if ('activities' in parsed && 'outcomes' in parsed) return 'theory_of_change';
  return null;
}
