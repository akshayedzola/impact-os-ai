# ImpactOS AI

**MIS Blueprint in 30 minutes.** Describe your nonprofit programme → get a complete Management Information System design powered by the MAP Framework and GPT-4o.

> Built on the MAP Framework: **Model → Align → Power with AI**

[![GitHub](https://img.shields.io/badge/GitHub-akshayedzola%2Fimpact--os--ai-black)](https://github.com/akshayedzola/impact-os-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![EdZola](https://img.shields.io/badge/Built%20by-EdZola-00d4aa)](https://edzola.com)

---

## The MAP Framework

ImpactOS is built on EdZola's MAP Framework for nonprofit data systems:

| Phase | What it does |
|---|---|
| **M — Model** | Start with Theory of Change → define what matters → indicators → data model |
| **A — Align** | One source of truth → module specs → stakeholder map → MIS blueprint |
| **P — Power with AI** | Dashboards → sprint plan → automation → (Phase 2: deploy live MIS) |

---

## What ImpactOS AI generates

From a natural language programme description, the app produces:

1. **Theory of Change** — Activities → Outputs → Outcomes → Impact + key indicators
2. **Data Model** — Entities, fields, relationships, naming conventions
3. **Module Specifications** — User stories, workflows, permissions per module
4. **Dashboard Plan** — 4–6 dashboards with KPI cards, charts, and RAG indicators
5. **Sprint Plan** — 6–7 sprint implementation roadmap with tasks and estimates
6. **Export** — DOCX, XLSX, PDF — ready to hand to a developer or funder

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| AI | OpenAI GPT-4o via Vercel AI SDK |
| Backend | Frappe (Python) — custom app `impact_os_ai` |
| Database | MariaDB (via Frappe) |
| Auth | Frappe JWT → httpOnly cookie |
| Export | python-docx + openpyxl (Frappe); @react-pdf/renderer (Next.js) |
| Payments | Stripe |
| Deploy | Vercel (frontend) + Frappe Cloud (backend) |

---

## Quick Start (Local Dev)

### Prerequisites
- Docker + Docker Compose
- Node.js 20+
- OpenAI API key

### 1. Clone and configure
```bash
git clone https://github.com/akshayedzola/impact-os-ai.git
cd impact-os-ai
cp .env.example frontend/.env.local
# Edit frontend/.env.local with your API keys
```

### 2. Start the backend (Frappe + MariaDB + Redis)
```bash
docker-compose up frappe mariadb redis -d
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Repository Structure

```
impact-os-ai/
├── frontend/          # Next.js 14+ app (Vercel)
│   ├── app/           # App Router pages + API routes
│   ├── components/    # MAP-structured UI components
│   ├── lib/           # Frappe client, OpenAI, auth helpers
│   ├── stores/        # Zustand state (auth, project, chat)
│   └── prompts/       # Open-source prompt templates
├── backend/           # Frappe app: impact_os_ai
│   └── apps/impact_os_ai/
│       ├── doctype/   # IOS Project, IOS User Profile, etc.
│       └── api/       # auth, projects, generate, chat, export
├── docs/              # Architecture, API contract, MAP framework
├── docker-compose.yml # Local dev: Frappe + MariaDB + Redis
└── funding.json       # Open infrastructure funding links
```

---

## Open Source

The following are published openly (this repo):
- Prompt templates (`frontend/prompts/`)
- MAP Framework playbook (`docs/map-framework.md`)
- ImpactOS methodology documentation
- Frappe DocType schemas

The hosted intelligence moat (sector-specific AI context, accumulated patterns, geography-specific calibrations) lives in the deployed platform at [impactos.edzola.ai](https://impactos.edzola.ai).

---

## Pricing

| Plan | Price | Projects | Export |
|---|---|---|---|
| Free | ₹0 / $0 | 1 | ToC preview only |
| Starter | ₹1,499/mo or $19/mo | 5 | DOCX + XLSX |
| Pro | ₹3,999/mo or $49/mo | Unlimited | DOCX + XLSX + PDF |
| Enterprise | Custom | Unlimited | All + Frappe MIS deploy |

**Per-deliverable:** ₹999 / $12 per blueprint export (no subscription).

---

## Phase 2: Auto-MIS Deployment

When a client approves the blueprint → "Deploy to Frappe" auto-creates:
- Frappe DocTypes from data model entities
- List views, form views, reports
- User roles and permissions
- A working live MIS — without a single line of manual code

---

## Contributing

Contributions to the open layers (prompts, data models, MAP playbook) are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Built by EdZola

[EdZola Technologies](https://edzola.com) builds data systems for the world's hardest work — nonprofits, social enterprises, and impact organisations across India and LMICs.

> *The flywheel: consulting surfaces problems → platform solves them at scale → platform users become consulting leads → consulting sharpens the platform.*

---

*Support open infrastructure for the social sector: [funding.json](funding.json)*
