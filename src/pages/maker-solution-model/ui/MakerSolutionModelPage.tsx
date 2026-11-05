"use client";

import { loadManual } from "@/entities/model-manual";
import type { SolutionDraft } from "@/entities/solution-draft";
import { SolutionDraftBuilder } from "@/features/build-solution-draft";
import { makerApi, modelApi, useApi } from "@/shared/api";
import { LoadState, PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  modelId: number;
};

export function MakerSolutionModelPage({ modelId }: Props) {
  const page = useApi(
    () =>
      Promise.all([
        modelApi.get(modelId),
        makerApi.modelHistories(modelId),
        loadManual(modelId),
      ]).then(([model, records, manual]) => ({ model, records, manual })),
    `solution-model:${modelId}`,
  );
  const approved =
    page.data?.manual.sections.filter((section) => section.type === "TROUBLESHOOTING").length ?? 0;

  // Approving appends the draft to the model's manual, which AI consultation answers from.
  async function saveToManual(draft: SolutionDraft) {
    const manual = await loadManual(modelId);
    const partCodes = [
      ...new Set(
        page.data?.records
          .filter((record) => draft.evidence.includes(String(record.id)))
          .map((record) => record.part.code),
      ),
    ];
    await makerApi.updateManual(modelId, {
      version: manual.version,
      sections: [
        ...manual.sections,
        {
          id: `sol-${Date.now().toString(36)}`,
          title: draft.title.trim().slice(0, 200),
          type: "TROUBLESHOOTING",
          symptoms: draft.symptoms,
          partCodes,
          content: draft.fallback.trim(),
          steps: draft.steps,
        },
      ],
    });
    page.reload();
  }

  return (
    <>
      <AppHeader side="maker" active="solutions" />
      <PageMain>
        {!page.data ? (
          <LoadState error={page.error} />
        ) : (
          <>
            <PageHeading
              back={{ href: "/maker/solutions", label: "솔루션 초안" }}
              title={`${page.data.model.code} · ${page.data.model.name}`}
              description={`수리 이력 ${page.data.model.repairHistoryCount}건 · 승인된 솔루션 ${approved}개. 이력을 골라 이 모델의 솔루션 초안을 만들어요.`}
            />
            <SolutionDraftBuilder
              key={modelId}
              model={page.data.model.code}
              records={page.data.records}
              onApprove={saveToManual}
            />
          </>
        )}
      </PageMain>
    </>
  );
}
