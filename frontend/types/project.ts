export interface TheoryOfChange {
  activities: string[];
  outputs: string[];
  outcomes: string[];
  impact: string;
  key_indicators: Array<{
    indicator: string;
    level: string;
    frequency: string;
    method: string;
  }>;
  stakeholders: Array<{
    name: string;
    information_needs: string[];
    data_they_provide: string[];
  }>;
}

export interface DataModelField {
  name: string;
  type: string;
  required: boolean;
  options?: string;
  validation?: string;
  description?: string;
  example?: string;
}

export interface DataModelEntity {
  name: string;
  purpose: string;
  description?: string;
  phase?: number;
  fields: DataModelField[];
  relationships: Array<{
    entity?: string;
    related_entity?: string;
    type: string;
    description?: string;
  }>;
}

export interface DataModel {
  entities: DataModelEntity[];
  hierarchy: string[];
  naming_convention: {
    id_format: string;
    examples: string[];
  };
}

export interface Module {
  name: string;
  purpose: string;
  primary_entity?: string;
  primary_users?: string[];
  user_stories: string[];
  key_workflows: string[];
  core_fields?: string[];
  automations?: string[];
  permissions: Array<{ role: string; access: string }>;
  reports?: string[];
  edge_cases?: string[];
  dependencies?: string[];
  phase?: number;
}

export interface ModuleSpecs {
  modules: Module[];
}

export interface KPICard {
  title?: string;
  label?: string;
  metric?: string;
  formula?: string;
  format?: string;
  target?: string;
}

export interface Chart {
  title: string;
  type: string;
  x_axis?: string;
  y_axis?: string;
  data_source?: string;
}

export interface Dashboard {
  name: string;
  audience: string;
  purpose: string;
  key_questions?: string[];
  kpi_cards: KPICard[];
  charts: Chart[];
  tables?: Array<{ name?: string; title?: string; columns: string[]; filters?: string[] }>;
  detail_table?: { title: string; columns: string[] };
  rag_indicators?: Array<{ indicator: string; green: string; amber: string; red: string }>;
  filters: string[];
}

export interface DashboardPlan {
  dashboards: Dashboard[];
}

export interface SprintTask {
  task: string;
  estimated_hours?: number;
  dependency?: string;
}

export interface Sprint {
  number: number;
  name: string;
  duration_weeks: number;
  goal: string;
  tasks: SprintTask[];
  modules?: string[];
  deliverables?: string[];
  testing?: string[];
  review_checkpoint?: string;
  dependencies?: string[];
  risks?: string[];
}

export interface SprintPlan {
  sprints: Sprint[];
  total_weeks: number;
  go_live_week: number;
}

export interface IProject {
  name: string;
  project_title: string;
  sector: string;
  organisation_type: string;
  country: string;
  description: string;
  team_size?: string;
  current_data_method?: string;
  funder_reporting?: string;
  status: 'draft' | 'in_progress' | 'completed';
  generation_status: 'idle' | 'generating' | 'done' | 'failed';
  generation_progress: string | null;
  theory_of_change: TheoryOfChange | null;
  data_model: DataModel | null;
  module_specs: ModuleSpecs | null;
  dashboard_plan: DashboardPlan | null;
  sprint_plan: SprintPlan | null;
  stakeholder_map?: unknown | null;
  checklists?: unknown | null;
  is_public: boolean;
  share_slug: string;
  creation: string;
  modified: string;
}

export type MAPPhase = 'model' | 'align' | 'power';
export type ProjectTab =
  | 'overview'
  | 'data-model'
  | 'modules'
  | 'dashboards'
  | 'sprint-plan'
  | 'chat'
  | 'checklists'
  | 'export';
