"use client";

import { useSearchParams } from "next/navigation";
import type { Consultation } from "@/entities/consultation";
import type { Equipment } from "@/entities/equipment";
import { equipmentApi, useApi } from "@/shared/api";
import { LoadState } from "@/shared/ui";
import { ModelViewer } from "@/widgets/model-viewer";

type Props = {
  // The sample consultation's own equipment, shown when no real one was picked.
  fallback: Equipment;
  suspect: Consultation["suspect"];
};

export function ConsultViewer({ fallback, suspect }: Props) {
  const equipmentId = Number(useSearchParams()?.get("equipment"));
  const hasId = Number.isInteger(equipmentId) && equipmentId > 0;
  const { data: equipment, error } = useApi(
    () => (hasId ? equipmentApi.get(equipmentId) : Promise.resolve(undefined)),
    `equipment:${hasId ? equipmentId : "sample"}`,
  );

  if (!hasId) {
    return (
      <ModelViewer
        name={fallback.name}
        details={`${fallback.model} · ${fallback.place}`}
        equipmentCode={fallback.unityCode}
        suspect={suspect}
      />
    );
  }
  if (!equipment) return <LoadState error={error} className="flex-1" />;
  return (
    <ModelViewer
      name={equipment.name}
      details={`${equipment.model.code} · ${equipment.location}`}
      equipmentCode={equipment.model.modelFileKey}
      suspect={suspect}
    />
  );
}
