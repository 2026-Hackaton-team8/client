import type { EquipmentModel } from "@/entities/equipment-model";
import type { ModelManual } from "@/entities/model-manual";
import { formatShortDate } from "@/shared/lib";
import { Badge, ButtonLink, PageHeading, PageMain, Panel, UnityViewer } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  model: EquipmentModel;
  manuals: ModelManual[];
};

export function MakerModelDetailPage({ model, manuals }: Props) {
  const specs = [
    ["모델", model.code],
    ["분류", model.category],
    ["제공 업체", model.maker],
    ["설치 대수", `${model.installs}대`],
    ["부품", `${model.partCount}개 (3D 기준)`],
    ["수리 이력", `${model.repairs}건 · 최근 ${formatShortDate(model.lastRepair)}`],
  ];

  return (
    <>
      <AppHeader side="maker" active="models" />
      <PageMain>
        <PageHeading
          back={{ href: "/maker/models", label: "모델 관리" }}
          title={`${model.code} · ${model.name}`}
          description="모델 정보와 3D 모델, 이 모델의 매뉴얼을 관리해요."
          action={
            <ButtonLink href={`/maker/models/${model.code}/manuals/new`} variant="strong">
              + 매뉴얼 등록
            </ButtonLink>
          }
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <Panel tone="plain" title="3D 모델" className="min-w-0 flex-1 gap-4">
            <UnityViewer
              label={`${model.code} 3D 모델`}
              equipmentCode={model.unityCode}
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
            {model.parts.length > 0 && (
              <Panel tone="outline" title="주요 부품" className="gap-3">
                <ul className="flex flex-wrap gap-1.5">
                  {model.parts.map((part) => (
                    <li key={part.code}>
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
          title={`매뉴얼 ${manuals.length}개`}
          titleAddon={
            <ButtonLink href={`/maker/models/${model.code}/manuals/new`} variant="soft" size="sm">
              + 매뉴얼 등록
            </ButtonLink>
          }
          className="gap-4"
        >
          {manuals.length === 0 ? (
            <p className="text-body-md text-secondary-600">
              아직 등록된 매뉴얼이 없어요. 문제 상황과 해결 방안을 등록하면 AI 상담이 답변에 써요.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {manuals.map((manual) => (
                <li key={manual.id} className="rounded-lg bg-secondary-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-title-md text-black">{manual.title}</h3>
                    <span className="text-body-sm text-secondary-600">
                      문제·해결 {manual.entries.length}쌍 · {formatShortDate(manual.createdAt)} 등록
                    </span>
                  </div>
                  <ol className="mt-3 flex flex-col gap-2">
                    {manual.entries.map((entry, index) => (
                      <li key={index} className="flex gap-3 text-body-md">
                        <span className="text-label-lg text-primary-500">{index + 1}</span>
                        <div className="flex min-w-0 flex-col">
                          <span className="text-black">{entry.problem}</span>
                          <span className="text-secondary-700">→ {entry.solution}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </PageMain>
    </>
  );
}
