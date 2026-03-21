import type { IProject } from '@/types/project';

export function buildProjectContext(project: IProject): string {
  const parts: string[] = [
    `PROJECT: ${project.project_title}`,
    `SECTOR: ${project.sector || 'not specified'}`,
    `ORG TYPE: ${project.organisation_type || 'not specified'}`,
    `COUNTRY: ${project.country || 'not specified'}`,
    `DESCRIPTION: ${project.description || 'not provided'}`,
  ];

  if (project.theory_of_change) {
    const toc = project.theory_of_change;
    parts.push(
      `\nTHEORY OF CHANGE:`,
      `Impact: ${toc.impact}`,
      `Outcomes: ${(toc.outcomes || []).slice(0, 3).join('; ')}`,
      `Outputs: ${(toc.outputs || []).slice(0, 3).join('; ')}`
    );
  }

  if (project.data_model) {
    const entityNames = (project.data_model.entities || []).map((e) => e.name).join(', ');
    parts.push(`\nDATA MODEL: ${entityNames || 'not yet generated'}`);
  }

  if (project.module_specs) {
    const modNames = (project.module_specs.modules || []).map((m) => m.name).join(', ');
    parts.push(`MODULES: ${modNames || 'not yet generated'}`);
  }

  if (project.sprint_plan) {
    parts.push(`SPRINT PLAN: ${project.sprint_plan.sprints?.length || 0} sprints, ${project.sprint_plan.total_weeks || 0} weeks total`);
  }

  return parts.join('\n');
}
