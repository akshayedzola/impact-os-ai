"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WizardData } from "./WizardShell";
import { ORG_TYPES, TEAM_SIZES, DATA_METHODS, FUNDER_OPTIONS } from "@/lib/constants";

export default function Step2OrgContext({
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
  const valid =
    data.organisation_type &&
    data.team_size &&
    data.current_data_method &&
    data.funder_reporting;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Your organisation context</h2>
        <p className="text-white/50 text-sm">
          <span className="text-[#b8ff4f]">A — Align:</span> Help us understand
          your team so we design a system that fits your capacity.
        </p>
      </div>

      <div className="space-y-5 bg-[#0f1a17] border border-white/8 rounded-xl p-6">
        <div className="space-y-1.5">
          <Label>Organisation Type</Label>
          <Select
            value={data.organisation_type}
            onValueChange={(v) => onChange({ organisation_type: v })}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select organisation type" />
            </SelectTrigger>
            <SelectContent>
              {ORG_TYPES.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Team Size</Label>
          <Select
            value={data.team_size}
            onValueChange={(v) => onChange({ team_size: v })}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="How many people in your team?" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_SIZES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Current Data Collection Method</Label>
          <Select
            value={data.current_data_method}
            onValueChange={(v) => onChange({ current_data_method: v })}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="How do you currently collect data?" />
            </SelectTrigger>
            <SelectContent>
              {DATA_METHODS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Funder Reporting Requirements</Label>
          <Select
            value={data.funder_reporting}
            onValueChange={(v) => onChange({ funder_reporting: v })}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Do you report to funders?" />
            </SelectTrigger>
            <SelectContent>
              {FUNDER_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          Next: Choose scope →
        </Button>
      </div>
    </div>
  );
}
