import { create } from "zustand";

export interface Project {
  name: string;
  project_title: string;
  description?: string;
  sector?: string;
  country?: string;
  organisation_type?: string;
  team_size?: string;
  current_data_method?: string;
  funder_reporting?: string;
  generation_status: "idle" | "generating" | "done" | "failed";
  theory_of_change?: Record<string, unknown> | null;
  data_model?: Record<string, unknown> | null;
  module_specs?: Record<string, unknown> | null;
  dashboard_plan?: Record<string, unknown> | null;
  sprint_plan?: Record<string, unknown> | null;
  is_public: boolean;
  creation?: string;
  modified?: string;
}

interface ProjectState {
  currentProject: Project | null;
  generationText: string;
  setCurrentProject: (project: Project) => void;
  clearCurrentProject: () => void;
  updateGeneration: (text: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  generationText: "",
  setCurrentProject: (project) => set({ currentProject: project }),
  clearCurrentProject: () => set({ currentProject: null, generationText: "" }),
  updateGeneration: (text) => set({ generationText: text }),
}));
