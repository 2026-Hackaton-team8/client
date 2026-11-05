"use client";

import { loadManual, sectionTypeLabels } from "@/entities/model-manual";
import { modelApi, useApi } from "@/shared/api";
import { unityCodeFor } from "@/shared/config";
import {
  Badge,
  ButtonLink,
  LoadState,
  PageHeading,
  PageMain,
  Panel,
  UnityViewer,
} from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  modelId: number;
};

export function MakerModelDetailPage({ modelId }: Props) {
  const model = useApi(() => modelApi.get(modelId), `model:${modelId}`);
  const parts = useApi(() => modelApi.parts(modelId), `parts:${modelId}`);
  const manual = useApi(() => loadManual(modelId), `manual:${modelId}`);
  const sections = manual.data?.sections ?? [];
  const manualHref = `/maker/models/${modelId}/manuals/new`;

  if (!model.data) {
    return (
      <>
        <AppHeader side="maker" active="models" />
        <PageMain>
          <LoadState error={model.error} />
        </PageMain>
      </>
    );
  }

  const specs = [
    ["모델", model.data.code],
    ["분류", model.data.category],
    ["제공 업체", model.data.makerCompanyName],
    ["부품", `${model.data.partCount}개`],
    ["수리 이력", `${model.data.repairHistoryCount}건`],
  ];

  return (
    <>
      <AppHeader side="maker" active="models" />
      <PageMain>
        <PageHeading
          back={{ href: "/maker/models", label: "모델 관리" }}
          title={`${model.data.code} · ${model.data.name}`}
          description="모델 정보와 3D 모델, 이 모델의 매뉴얼을 관리해요."
          action={
            <ButtonLink href={manualHref} variant="strong">
              + 매뉴얼 등록
            </ButtonLink>
          }
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <Panel tone="plain" title="3D 모델" className="min-w-0 flex-1 gap-4">
            <UnityViewer
              label={`${model.data.code} 3D 모델`}
              equipmentCode={unityCodeFor(model.data)}
              className="h-120"
            />
          </Panel>
          <aside className="flex shrink-0 flex-col gap-6 lg:w-100">
            <Panel title="모델 정보" className="gap-4">
              <dl className="flex flex-col gap-2.5 text-body-md">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex">
                    <dt className="w-22 shrink-0 text-secondary-600">{label}</dt>
                    <dd className="text-black">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
            {!!parts.data?.length && (
              <Panel tone="outline" title="주요 부품" className="gap-3">
                <ul className="flex flex-wrap gap-1.5">
                  {parts.data.map((part) => (
                    <li key={part.id}>
                      <Badge>
                        {part.name} · {part.code}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </aside>
        </div>

        <Panel
          tone="outline"
          title={`매뉴얼 ${sections.length}개 항목`}
          titleAddon={
            <span className="flex items-center gap-3">
              {manual.data?.version !== undefined && (
                <span className="text-body-sm text-secondary-600">v{manual.data.version}</span>
              )}
              <ButtonLink href={manualHref} variant="soft" size="sm">
                + 매뉴얼 등록
              </ButtonLink>
            </span>
          }
          className="gap-4"
        >
          {manual.loading || manual.error ? (
            <LoadState error={manual.error} />
          ) : sections.length === 0 ? (
            <p className="text-body-md text-secondary-600">
              아직 등록된 매뉴얼이 없어요. 문제 상황과 해결 방안을 등록하면 AI 상담이 답변에 써요.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {sections.map((section) => (
                <li key={section.id} className="flex flex-col gap-2 rounded-lg bg-secondary-50 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="primary">{sectionTypeLabels[section.type]}</Badge>
                    <h3 className="text-title-md text-black">{section.title}</h3>
                  </div>
                  <p className="text-body-md whitespace-pre-line text-secondary-700">
                    {section.content}
                  </p>
                  {!!section.steps?.length && (
                    <ol className="flex list-inside list-decimal flex-col gap-1 text-body-md text-black">
                      {section.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </PageMain>
    </>
  );
}
