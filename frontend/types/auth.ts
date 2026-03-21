export type Plan = 'free' | 'starter' | 'pro' | 'enterprise';

export interface IUser {
  userId: string;
  email: string;
  fullName: string;
  organisationName: string;
  plan: Plan;
  projectsUsed: number;
}

export interface PlanLimits {
  projects: number;
  export: string[];
  features: string[];
}
