/**
 * File-based mock database for local dev without Frappe.
 * Data is stored in frontend/.dev-data/db.json
 * Only active when MOCK_MODE=true
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), ".dev-data", "db.json");

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
  status: string; // draft | generating | completed | failed
  generation_progress: number;
  theory_of_change: string;
  data_model: string;
  module_specs: string;
  dashboard_plan: string;
  sprint_plan: string;
  share_slug: string;
  owner: string; // userId
  createdAt: string;
  updatedAt: string;
}

interface MockDB {
  users: MockUser[];
  projects: MockProject[];
}

function readDB(): MockDB {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [], projects: [] };
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { users: [], projects: [] };
  }
}

function writeDB(db: MockDB) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "impactos-salt").digest("hex");
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) +
    "-" +
    crypto.randomBytes(3).toString("hex");
}

// ── User operations ──────────────────────────────────────────────────────────

export function createUser(
  email: string,
  password: string,
  fullName: string,
  organisationName: string,
): MockUser {
  const db = readDB();
  if (db.users.find((u) => u.email === email)) {
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
  db.users.push(user);
  writeDB(db);
  return user;
}

export function verifyUser(email: string, password: string): MockUser | null {
  const db = readDB();
  const user = db.users.find(
    (u) => u.email === email && u.passwordHash === hashPassword(password),
  );
  return user || null;
}

export function getUserById(userId: string): MockUser | null {
  const db = readDB();
  return db.users.find((u) => u.userId === userId) || null;
}

// ── Project operations ───────────────────────────────────────────────────────

export function createProject(
  data: Partial<MockProject>,
  userId: string,
): MockProject {
  const db = readDB();
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
  db.projects.push(project);
  writeDB(db);
  return project;
}

export function getProject(projectName: string): MockProject | null {
  const db = readDB();
  return db.projects.find((p) => p.project_name === projectName) || null;
}

export function listProjects(userId: string): MockProject[] {
  const db = readDB();
  return db.projects.filter((p) => p.owner === userId);
}

export function updateProject(
  projectName: string,
  patch: Partial<MockProject>,
): MockProject | null {
  const db = readDB();
  const idx = db.projects.findIndex((p) => p.project_name === projectName);
  if (idx === -1) return null;
  db.projects[idx] = {
    ...db.projects[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeDB(db);
  return db.projects[idx];
}
