"use client";
import { Button } from "@/components/ui/button";
import type { WizardData } from "./WizardShell";
import { SECTORS, ORG_TYPES, TEAM_SIZES, DATA_METHODS, FUNDER_OPTIONS, SCOPE_OPTIONS } from "@/lib/constants";
import { Zap } from "lucide-react";

function findLabel(
  options: { value: string; label: string }[],
  value: string,
) {
  return options.find((o) => o.value === value)?.label || value;
}

export default function Step4ReviewGenerate({
  data,
  onBack,
  onGenerate,
  loading,
}: {
  data: WizardData;
  onBack: () => void;
  onGenerate: () => void;
  loading: boolean;
}) {
  const selectedScope = SCOPE_OPTIONS.filter((o) => data.scope.includes(o.key));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Ready to generate</h2>
        <p className="text-white/50 text-sm">
          Review your inputs. Once you click Generate, ImpactOS AI will build
          your complete MIS Blueprint using the MAP Framework.
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-[#0f1a17] border border-white/8 rounded-xl p-6 space-y-4 mb-6">
        {/* Programme */}
        <div>
          <div className="text-[10px] text-[#00d4aa] uppercase tracking-wider font-bold mb-2">
            M — Programme Details
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <ReviewRow label="Project Name" value={data.project_title} />
            <ReviewRow
              label="Sector"
              value={findLabel(SECTORS, data.sector)}
            />
            <ReviewRow label="Country" value={data.country || "Not specified"} />
          </div>
          {data.description && (
            <div className="mt-3">
              <div className="text-[10px] text-white/30 mb-1">Description</div>
              <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                {data.description}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-white/6" />

        {/* Organisation */}
        <div>
          <div className="text-[10px] text-[#b8ff4f] uppercase tracking-wider font-bold mb-2">
            A — Organisation Context
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <ReviewRow
              label="Org Type"
              value={findLabel(ORG_TYPES, data.organisation_type)}
            />
            <ReviewRow
              label="Team Size"
              value={findLabel(TEAM_SIZES, data.team_size)}
            />
            <ReviewRow
              label="Current Data Method"
              value={findLabel(DATA_METHODS, data.current_data_method)}
            />
            <ReviewRow
              label="Funder Reporting"
              value={findLabel(FUNDER_OPTIONS, data.funder_reporting)}
            />
          </div>
        </div>

        <div className="border-t border-white/6" />

        {/* Scope */}
        <div>
          <div className="text-[10px] text-[#7c3aed] uppercase tracking-wider font-bold mb-2">
            P — Blueprint Scope
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedScope.map((opt) => (
              <span
                key={opt.key}
                className="text-xs px-2.5 py-1 rounded-full border"
                style={{
                  color: opt.color,
                  borderColor: opt.color + "30",
                  backgroundColor: opt.color + "12",
                }}
              >
                {opt.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Generate CTA */}
      <div className="bg-gradient-to-br from-[#00d4aa]/10 to-[#b8ff4f]/5 border border-[#00d4aa]/20 rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-xl ios-gradient flex items-center justify-center mx-auto mb-3">
          <Zap className="w-6 h-6 text-[#080e0c]" />
        </div>
        <h3 className="font-bold text-lg mb-1">Generate my MIS Blueprint</h3>
        <p className="text-white/50 text-sm mb-5">
          ImpactOS AI will generate your complete blueprint in about 30 seconds.
          This uses your AI credits.
        </p>
        <Button
          onClick={onGenerate}
          disabled={loading}
          size="lg"
          className="bg-[#00d4aa] text-[#080e0c] hover:bg-[#00d4aa]/90 font-bold px-8 gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#080e0c] border-t-transparent rounded-full animate-spin" />
              Starting generation...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Generate Blueprint
            </>
          )}
        </Button>
      </div>

      <div className="flex justify-start mt-4">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={loading}
          className="text-white/50 hover:text-white"
        >
          ← Back
        </Button>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-white/30 mb-0.5">{label}</div>
      <div className="text-sm text-white/80">{value || "—"}</div>
    </div>
  );
}
