import type { EquipmentModel } from "@/entities/equipment-model";
import { recordsForModel } from "@/entities/repair-record";
import { findDraftForModel } from "@/entities/solution-draft";
import { SolutionDraftBuilder } from "@/features/build-solution-draft";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  model: EquipmentModel;
};

export function MakerSolutionModelPage({ model }: Props) {
  const counts = [
    { label: "검토 대기", value: model.pendingDrafts, selected: true },
    { label: "승인됨", value: model.approvedSolutions, selected: false },
  ];

  return (
    <>
      <AppHeader side="maker" active="solutions" />
      <PageMain>
        <PageHeading
          back={{ href: "/maker/solutions", label: "솔루션 초안" }}
          title={`${model.code} · ${model.name}`}
          description={`설치 ${model.installs}대 · 수리 이력 ${model.repairs}건 · 승인된 솔루션 ${model.approvedSolutions}개. 이력을 골라 이 모델의 솔루션 초안을 만들어요.`}
          action={
            <ul aria-label="솔루션 현황" className="flex gap-2">
              {counts.map((count) => (
                <li
                  key={count.label}
                  className={`rounded-full border-2 px-3.5 py-2 text-label-lg ${
                    count.selected
                      ? "border-primary-300 bg-primary-100 text-black"
                      : "border-secondary-100 text-secondary-700"
                  }`}
                >
                  {count.label} {count.value}
                </li>
              ))}
            </ul>
          }
        />
        <SolutionDraftBuilder
          key={model.code}
          model={model.code}
          records={recordsForModel(model.code)}
          initialDraft={findDraftForModel(model.code)}
        />
      </PageMain>
    </>
  );
}
