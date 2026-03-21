"use client";
import { Button } from "@/components/ui/button";
import type { WizardData } from "./WizardShell";
import { SCOPE_OPTIONS } from "@/lib/constants";
import { CheckSquare, Square } from "lucide-react";

export default function Step3Scope({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: WizardData;
  onChange: (p: Partial<WizardData>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const valid = data.scope.length > 0;

  function toggleScope(key: string) {
    const next = data.scope.includes(key)
      ? data.scope.filter((s) => s !== key)
      : [...data.scope, key];
    onChange({ scope: next });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Choose what to generate</h2>
        <p className="text-white/50 text-sm">
          <span className="text-[#7c3aed]">P — Power with AI:</span> Select the
          blueprint sections you need. All are recommended for a complete MIS
          design.
        </p>
      </div>

      <div className="space-y-3 bg-[#0f1a17] border border-white/8 rounded-xl p-6">
        {SCOPE_OPTIONS.map((option) => {
          const selected = data.scope.includes(option.key);
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => toggleScope(option.key)}
              className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all text-left ${
                selected
                  ? "border-white/15 bg-white/5"
                  : "border-white/6 hover:border-white/10 hover:bg-white/3"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {selected ? (
                  <CheckSquare
                    className="w-4 h-4"
                    style={{ color: option.color }}
                  />
                ) : (
                  <Square className="w-4 h-4 text-white/25" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{
                      color: option.color,
                      backgroundColor: option.color + "18",
                    }}
                  >
                    {option.phase}
                  </span>
                </div>
                <p className="text-xs text-white/40">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 px-1">
        <p className="text-xs text-white/30">
          {data.scope.length} of {SCOPE_OPTIONS.length} sections selected
          {data.scope.length === SCOPE_OPTIONS.length && (
            <span className="text-[#00d4aa] ml-1">— Full blueprint</span>
          )}
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white/50 hover:text-white"
        >
          ← Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!valid}
          className="bg-[#00d4aa] text-[#080e0c] hover:bg-[#00d4aa]/90 font-semibold px-6"
        >
          Review & Generate →
        </Button>
      </div>
    </div>
  );
}
