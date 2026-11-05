"use client";

import { RegisterManualForm } from "@/features/register-manual";
import { modelApi, useApi } from "@/shared/api";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  modelId: number;
};

export function MakerManualRegisterPage({ modelId }: Props) {
  const { data: model } = useApi(() => modelApi.get(modelId), `model:${modelId}`);
  const code = model?.code ?? "";

  return (
    <>
      <AppHeader side="maker" active="models" />
      <PageMain>
        <PageHeading
          back={{
            href: `/maker/models/${modelId}`,
            label: model ? `${model.code} · ${model.name}` : "모델 상세",
          }}
          title="매뉴얼 등록"
          description="자주 생기는 문제 상황과 해결 방안을 짝지어 적어 주세요. 필요한 만큼 추가할 수 있어요."
        />
        <RegisterManualForm modelId={modelId} modelCode={code} />
      </PageMain>
    </>
  );
}
