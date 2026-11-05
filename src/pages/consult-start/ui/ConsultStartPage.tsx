"use client";

import { StartConsultationForm } from "@/features/start-consultation";
import { equipmentApi, useApi } from "@/shared/api";
import { LoadState, PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  equipmentId: number;
};

export function ConsultStartPage({ equipmentId }: Props) {
  const { data: equipment, error } = useApi(
    () => equipmentApi.get(equipmentId),
    `equipment:${equipmentId}`,
  );

  return (
    <>
      <AppHeader side="user" active="equipment" />
      <PageMain>
        <PageHeading
          back={{ href: "/", label: "내 설비" }}
          title="고장 상담"
          description="증상을 적으면 AI가 원인을 좁혀 가며 해결 방법을 알려 드려요."
        />
        {equipment ? <StartConsultationForm equipment={equipment} /> : <LoadState error={error} />}
      </PageMain>
    </>
  );
}
