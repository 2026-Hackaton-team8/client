import { findEquipment } from "@/entities/equipment";
import { findModel } from "@/entities/equipment-model";
import type { ServiceCall } from "@/entities/service-call";
import { RepairRecordForm } from "@/features/record-repair";
import { unityPartsFor } from "@/shared/config";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  call: ServiceCall;
};

export function MakerRepairRecordPage({ call }: Props) {
  const equipmentCode = findEquipment(call.equipmentId)?.unityCode;
  // Parts come from the Unity catalog so picking one highlights it in 3D.
  const unityParts = unityPartsFor(equipmentCode).map((part) => ({
    code: part.partCode,
    name: part.name,
  }));
  const parts = unityParts.length ? unityParts : (findModel(call.model)?.parts ?? []);
  const defaultPart = parts.some((part) => part.code === call.unityPart)
    ? call.unityPart
    : (parts[0]?.code ?? "");

  return (
    <>
      <AppHeader side="maker" active="records" />
      <PageMain>
        <PageHeading
          back={{ href: `/maker/calls/${call.id}`, label: "호출 상세" }}
          title="수리 기록"
          description={`${call.company} · ${call.equipmentName} · ${call.model}`}
        />
        <RepairRecordForm
          callId={call.id}
          model={call.model}
          parts={parts}
          defaultPart={defaultPart}
          equipmentCode={equipmentCode}
        />
      </PageMain>
    </>
  );
}
