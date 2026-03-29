/**
 * In-memory mock database for local dev / Vercel preview without Frappe.
 * Data lives in the Node.js process — resets on cold start (fine for demos).
 * Only active when MOCK_MODE=true.
 */
import crypto from "crypto";

interface MockUser {
  userId: string;
  email: string;
  passwordHash: string;
  fullName: string;
  organisationName: string;
  plan: string;
  projectsUsed: number;
  createdAt: string;
}

interface MockProject {
  project_name: string;
  project_title: string;
  description: string;
  sector: string;
  country: string;
  organisation_type: string;
  team_size: string;
  current_data_method: string;
  funder_reporting: string;
  status: string;
  generation_progress: number;
  theory_of_change: string;
  data_model: string;
  module_specs: string;
  dashboard_plan: string;
  sprint_plan: string;
  share_slug: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// Global in-memory store (survives across requests in the same process)
const store: { users: MockUser[]; projects: MockProject[] } = {
  users: [],
  projects: [],
};

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "impactos-salt").digest("hex");
}

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) +
    "-" +
    crypto.randomBytes(3).toString("hex")
  );
}

// ── User operations ───────────────────────────────────────────────────────────

export function createUser(
  email: string,
  password: string,
  fullName: string,
  organisationName: string,
): MockUser {
  if (store.users.find((u) => u.email === email)) {
    throw new Error("User already exists with this email");
  }
  const user: MockUser = {
    userId: crypto.randomUUID(),
    email,
    passwordHash: hashPassword(password),
    fullName,
    organisationName,
    plan: "free",
    projectsUsed: 0,
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  return user;
}

export function verifyUser(email: string, password: string): MockUser | null {
  return (
    store.users.find(
      (u) => u.email === email && u.passwordHash === hashPassword(password),
    ) || null
  );
}

export function getUserById(userId: string): MockUser | null {
  return store.users.find((u) => u.userId === userId) || null;
}

// ── Project operations ────────────────────────────────────────────────────────

export function createProject(
  data: Partial<MockProject>,
  userId: string,
): MockProject {
  const slug = generateSlug(data.project_title || "project");
  const project: MockProject = {
    project_name: slug,
    project_title: data.project_title || "",
    description: data.description || "",
    sector: data.sector || "",
    country: data.country || "",
    organisation_type: data.organisation_type || "",
    team_size: data.team_size || "",
    current_data_method: data.current_data_method || "",
    funder_reporting: data.funder_reporting || "",
    status: "draft",
    generation_progress: 0,
    theory_of_change: "",
    data_model: "",
    module_specs: "",
    dashboard_plan: "",
    sprint_plan: "",
    share_slug: crypto.randomBytes(6).toString("hex"),
    owner: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.projects.push(project);
  return project;
}

export function getProject(projectName: string): MockProject | null {
  return store.projects.find((p) => p.project_name === projectName) || null;
}

export function listProjects(userId: string): MockProject[] {
  return store.projects.filter((p) => p.owner === userId);
}

export function updateProject(
  projectName: string,
  patch: Partial<MockProject>,
): MockProject | null {
  const idx = store.projects.findIndex((p) => p.project_name === projectName);
  if (idx === -1) return null;
  store.projects[idx] = {
    ...store.projects[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return store.projects[idx];
}
