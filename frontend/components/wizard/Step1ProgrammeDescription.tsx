"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WizardData } from "./WizardShell";
import { SECTORS } from "@/lib/constants";

export default function Step1ProgrammeDescription({
  data,
  onChange,
  onNext,
}: {
  data: WizardData;
  onChange: (p: Partial<WizardData>) => void;
  onNext: () => void;
}) {
  const valid =
    data.project_title.trim() && data.description.trim().length >= 50;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Describe your programme</h2>
        <p className="text-white/50 text-sm">
          <span className="text-[#00d4aa]">M — Model:</span> Start with what
          matters. Tell us about your programme in your own words.
        </p>
      </div>

      <div className="space-y-5 bg-[#0f1a17] border border-white/8 rounded-xl p-6">
        <div className="space-y-1.5">
          <Label htmlFor="projectTitle">Project / MIS Name</Label>
          <Input
            id="projectTitle"
            placeholder="e.g. Youth Livelihoods MIS, WASH Programme Tracker"
            value={data.project_title}
            onChange={(e) => onChange({ project_title: e.target.value })}
            className="bg-white/5 border-white/10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Programme Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what your organisation does, who you serve, what outcomes you're working towards, and what data you need to track. The more detail you give, the better the blueprint. (minimum 50 characters)"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="bg-white/5 border-white/10 min-h-[140px]"
          />
          <div
            className={`text-xs ${
              data.description.length < 50
                ? "text-white/30"
                : "text-[#00d4aa]"
            }`}
          >
            {data.description.length} characters
            {data.description.length < 50 &&
              ` (${50 - data.description.length} more needed)`}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Sector</Label>
            <Select
              value={data.sector}
              onValueChange={(v) => onChange({ sector: v })}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="e.g. India, Kenya, Bangladesh"
              value={data.country}
              onChange={(e) => onChange({ country: e.target.value })}
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={onNext}
          disabled={!valid}
          className="bg-[#00d4aa] text-[#080e0c] hover:bg-[#00d4aa]/90 font-semibold px-6"
        >
          Next: Organisation context →
        </Button>
      </div>
    </div>
  );
}
