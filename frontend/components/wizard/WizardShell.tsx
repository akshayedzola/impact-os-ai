"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Step1ProgrammeDescription from "./Step1ProgrammeDescription";
import Step2OrgContext from "./Step2OrgContext";
import Step3Scope from "./Step3Scope";
import Step4ReviewGenerate from "./Step4ReviewGenerate";
import { frappeCall } from "@/lib/frappe/client";
import { getToken } from "@/lib/auth";

export interface WizardData {
  // Step 1
  project_title: string;
  description: string;
  sector: string;
  country: string;
  // Step 2
  organisation_type: string;
  team_size: string;
  current_data_method: string;
  funder_reporting: string;
  // Step 3
  scope: string[];
}

const DEFAULT_DATA: WizardData = {
  project_title: "",
  description: "",
  sector: "",
  country: "",
  organisation_type: "",
  team_size: "",
  current_data_method: "",
  funder_reporting: "",
  scope: ["toc", "data_model", "modules", "dashboards", "sprint_plan"],
};

const STEP_LABELS = ["Programme", "Organisation", "Scope", "Generate"];

export default function WizardShell() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function update(patch: Partial<WizardData>) {
    setData((d) => ({ ...d, ...patch }));
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      // Create project
      const created = await frappeCall<{ project_name: string }>(
        "projects",
        "create_project",
        {
          project_title: data.project_title,
          description: data.description,
          sector: data.sector,
          organisation_type: data.organisation_type,
          team_size: data.team_size,
          current_data_method: data.current_data_method,
          funder_reporting: data.funder_reporting,
        },
        "POST",
        token,
      );

      // Start generation
      await frappeCall(
        "generate",
        "start",
        {
          project_name: created.project_name,
          scope: JSON.stringify(data.scope),
        },
        "POST",
        token,
      );

      router.push(`/projects/${created.project_name}/overview`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate blueprint",
      );
      setLoading(false);
    }
  }

  const steps = [
    <Step1ProgrammeDescription
      key={1}
      data={data}
      onChange={update}
      onNext={() => setStep(2)}
    />,
    <Step2OrgContext
      key={2}
      data={data}
      onChange={update}
      onBack={() => setStep(1)}
      onNext={() => setStep(3)}
    />,
    <Step3Scope
      key={3}
      data={data}
      onChange={update}
      onBack={() => setStep(2)}
      onNext={() => setStep(4)}
    />,
    <Step4ReviewGenerate
      key={4}
      data={data}
      onBack={() => setStep(3)}
      onGenerate={handleGenerate}
      loading={loading}
    />,
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s < step
                  ? "bg-[#00d4aa] text-[#080e0c]"
                  : s === step
                    ? "bg-[#00d4aa]/20 text-[#00d4aa] border border-[#00d4aa]/40"
                    : "bg-white/5 text-white/30"
              }`}
            >
              {s < step ? "✓" : s}
            </div>
            {s < 4 && (
              <div
                className={`h-px w-8 ${s < step ? "bg-[#00d4aa]/40" : "bg-white/10"}`}
              />
            )}
          </div>
        ))}
        <div className="ml-2 text-xs text-white/40">
          Step {step} of 4 — {STEP_LABELS[step - 1]}
        </div>
      </div>

      {steps[step - 1]}
    </div>
  );
}
