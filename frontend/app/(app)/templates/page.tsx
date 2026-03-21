"use client";
import Link from "next/link";
import { Library, ArrowRight } from "lucide-react";
import { SECTORS } from "@/lib/constants";

const TEMPLATES = [
  {
    slug: "youth-livelihoods",
    title: "Youth Livelihoods MIS",
    sector: "livelihoods",
    description:
      "Track skilling batches, participants, trainers, placements, and employer outcomes. Includes follow-up tracking up to 6 months post-placement.",
    entities: 9,
    dashboards: 5,
  },
  {
    slug: "community-health",
    title: "Community Health Programme",
    sector: "health",
    description:
      "Manage beneficiaries, health workers, household visits, screenings, and referrals. Includes supply chain and training module.",
    entities: 11,
    dashboards: 4,
  },
  {
    slug: "school-education",
    title: "School Education Programme",
    sector: "education",
    description:
      "Track students, teachers, sessions, assessments, and attendance across partner schools. Includes learning outcome indicators.",
    entities: 8,
    dashboards: 5,
  },
  {
    slug: "grant-management",
    title: "Grant Management System",
    sector: "fundraising",
    description:
      "Manage donors, grants, proposals, budgets, milestones, and funder reports. Includes compliance tracking and payment schedules.",
    entities: 7,
    dashboards: 3,
  },
];

export default function TemplatesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Blueprint Templates</h1>
        <p className="text-white/50 text-sm">
          Start with a pre-built MIS blueprint for your sector. Customise with
          AI.
        </p>
      </div>

      {TEMPLATES.length === 0 ? (
        <div className="text-center py-20">
          <Library className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">
            Templates coming soon. Use the wizard to create a custom blueprint.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((t) => {
            const sectorLabel =
              SECTORS.find((s) => s.value === t.sector)?.label || t.sector;
            return (
              <div
                key={t.slug}
                className="bg-[#0f1a17] border border-white/8 rounded-xl p-5 hover:border-[#00d4aa]/20 hover:shadow-[0_0_20px_rgba(0,212,170,0.05)] transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-[#00d4aa] transition-colors">
                      {t.title}
                    </h3>
                    <span className="text-xs text-white/40 mt-0.5 block">
                      {sectorLabel}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/15 flex items-center justify-center flex-shrink-0">
                    <Library className="w-3.5 h-3.5 text-[#00d4aa]" />
                  </div>
                </div>

                <p className="text-xs text-white/50 leading-relaxed mb-4">
                  {t.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-[10px] text-white/30">
                    <span>{t.entities} entities</span>
                    <span>·</span>
                    <span>{t.dashboards} dashboards</span>
                  </div>
                  <Link href={`/projects/new?template=${t.slug}`}>
                    <div className="flex items-center gap-1.5 text-xs text-[#00d4aa] hover:underline">
                      Use template
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-[#0f1a17] border border-white/8 rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm mb-0.5">Don&apos;t see your sector?</div>
          <p className="text-xs text-white/40">
            Use the AI wizard to describe your programme and get a custom
            blueprint in 30 seconds.
          </p>
        </div>
        <Link href="/projects/new">
          <div className="flex-shrink-0 ml-4 px-4 py-2 rounded-lg bg-[#00d4aa]/15 border border-[#00d4aa]/25 text-[#00d4aa] text-sm font-medium hover:bg-[#00d4aa]/25 transition-colors whitespace-nowrap">
            Create custom →
          </div>
        </Link>
      </div>
    </div>
  );
}
