import { findModel } from "@/entities/equipment-model";
import type { ServiceCall } from "@/entities/service-call";
import { RepairRecordForm } from "@/features/record-repair";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  call: ServiceCall;
};

export function MakerRepairRecordPage({ call }: Props) {
  const parts = findModel(call.model)?.parts ?? [];
  const defaultPart =
    call.suspectParts.find((part) => part.state === "next")?.code ?? parts[0]?.code ?? "";

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
        />
      </PageMain>
    </>
  );
}
