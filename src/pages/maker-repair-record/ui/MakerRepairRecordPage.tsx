"use client";

import { RepairRecordForm } from "@/features/record-repair";
import { makerApi, modelApi, useApi } from "@/shared/api";
import { LoadState, PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  requestId: number;
};

export function MakerRepairRecordPage({ requestId }: Props) {
  const page = useApi(async () => {
    const call = await makerApi.request(requestId);
    const [model, parts] = await Promise.all([
      modelApi.get(call.equipment.modelId),
      modelApi.parts(call.equipment.modelId),
    ]);
    return { call, model, parts };
  }, `repair-record:${requestId}`);

  return (
    <>
      <AppHeader side="maker" active="records" />
      <PageMain>
        {!page.data ? (
          <LoadState error={page.error} />
        ) : (
          <>
            <PageHeading
              back={{ href: `/maker/calls/${requestId}`, label: "호출 상세" }}
              title="수리 기록"
              description={`${page.data.call.company.name} · ${page.data.call.equipment.name} · ${page.data.model.code}`}
            />
            <RepairRecordForm
              requestId={requestId}
              model={page.data.model.code}
              parts={page.data.parts}
              equipmentCode={page.data.model.modelFileKey}
            />
          </>
        )}
      </PageMain>
    </>
  );
}
