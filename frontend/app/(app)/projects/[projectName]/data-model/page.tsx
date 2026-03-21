"use client";
import { useProjectStore } from "@/stores/project-store";
import { Database } from "lucide-react";

interface Field {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  validation?: string;
  related_entity?: string;
  relationship_type?: string;
}

interface Entity {
  name: string;
  description?: string;
  fields: Field[];
}

interface DataModel {
  entities: Entity[];
}

export default function DataModelPage() {
  const { currentProject } = useProjectStore();

  if (!currentProject) return null;

  const dataModel = currentProject.data_model as DataModel | null;

  if (!dataModel || !dataModel.entities) {
    return (
      <div className="text-center py-20">
        <Database className="w-12 h-12 text-white/20 mx-auto mb-3" />
        <p className="text-white/40 text-sm">
          Data model not yet generated. Return to the overview to check
          generation status.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Data Model</h1>
        <p className="text-white/50 text-sm">
          <span className="text-[#00d4aa]">M — Model:</span>{" "}
          {dataModel.entities.length} entities defined for{" "}
          {currentProject.project_title}
        </p>
      </div>

      <div className="space-y-6">
        {dataModel.entities.map((entity) => (
          <div
            key={entity.name}
            className="bg-[#0f1a17] border border-white/8 rounded-xl overflow-hidden"
          >
            {/* Entity header */}
            <div className="px-5 py-4 border-b border-white/6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center">
                <Database className="w-4 h-4 text-[#00d4aa]" />
              </div>
              <div>
                <div className="font-semibold text-sm">{entity.name}</div>
                {entity.description && (
                  <div className="text-xs text-white/40 mt-0.5">
                    {entity.description}
                  </div>
                )}
              </div>
              <div className="ml-auto text-xs text-white/30">
                {entity.fields?.length || 0} fields
              </div>
            </div>

            {/* Fields table */}
            {entity.fields && entity.fields.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/6">
                      <th className="text-left px-5 py-2.5 text-[10px] text-white/30 font-medium uppercase tracking-wider">
                        Field Name
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] text-white/30 font-medium uppercase tracking-wider">
                        Type
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] text-white/30 font-medium uppercase tracking-wider">
                        Required
                      </th>
                      <th className="text-left px-5 py-2.5 text-[10px] text-white/30 font-medium uppercase tracking-wider">
                        Description / Validation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity.fields.map((field, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors"
                      >
                        <td className="px-5 py-3 font-mono text-xs text-white/80">
                          {field.name}
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] font-medium">
                            {field.type}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {field.required ? (
                            <span className="text-xs text-[#b8ff4f]">Yes</span>
                          ) : (
                            <span className="text-xs text-white/30">No</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-white/50">
                          {field.description || field.validation || "—"}
                          {field.related_entity && (
                            <span className="text-[#7c3aed] ml-1">
                              → {field.related_entity}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
