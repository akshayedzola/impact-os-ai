export const SECTORS = [
  { value: "livelihoods", label: "Livelihoods & Skilling" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "environment", label: "Environment & Conservation" },
  { value: "governance", label: "Governance & Advocacy" },
  { value: "fundraising", label: "Fundraising & Grant Management" },
  { value: "other", label: "Other" },
];

export const ORG_TYPES = [
  { value: "ngo", label: "NGO / Non-profit" },
  { value: "social_enterprise", label: "Social Enterprise" },
  { value: "cbo", label: "Community-Based Organisation (CBO)" },
  { value: "foundation", label: "Foundation / Trust" },
  { value: "government", label: "Government / Public Sector" },
  { value: "other", label: "Other" },
];

export const TEAM_SIZES = [
  { value: "1-5", label: "1–5 people" },
  { value: "6-20", label: "6–20 people" },
  { value: "21-50", label: "21–50 people" },
  { value: "51-100", label: "51–100 people" },
  { value: "100+", label: "100+ people" },
];

export const DATA_METHODS = [
  { value: "paper", label: "Paper / physical forms" },
  { value: "excel", label: "Spreadsheets (Excel / Google Sheets)" },
  { value: "google_forms", label: "Google Forms" },
  { value: "kobo", label: "KoBoToolbox / ODK" },
  { value: "existing_mis", label: "Existing MIS / CRM software" },
  { value: "none", label: "No system currently" },
];

export const FUNDER_OPTIONS = [
  { value: "yes_quarterly", label: "Yes — quarterly reports" },
  { value: "yes_annual", label: "Yes — annual reports" },
  { value: "yes_milestone", label: "Yes — milestone-based" },
  { value: "no", label: "No formal funder reporting" },
];

export const SCOPE_OPTIONS = [
  {
    key: "toc",
    label: "Theory of Change",
    description: "Map activities → outputs → outcomes → impact",
    phase: "M — Model",
    color: "#00d4aa",
  },
  {
    key: "data_model",
    label: "Data Model",
    description: "Entities, fields, relationships & validation rules",
    phase: "M — Model",
    color: "#00d4aa",
  },
  {
    key: "modules",
    label: "Module Specifications",
    description: "User stories, workflows, permissions per module",
    phase: "A — Align",
    color: "#b8ff4f",
  },
  {
    key: "dashboards",
    label: "Dashboard Plan",
    description: "KPIs, chart types & audience for each dashboard",
    phase: "P — Power",
    color: "#7c3aed",
  },
  {
    key: "sprint_plan",
    label: "Sprint Plan",
    description: "Week-by-week implementation roadmap",
    phase: "P — Power",
    color: "#7c3aed",
  },
];
