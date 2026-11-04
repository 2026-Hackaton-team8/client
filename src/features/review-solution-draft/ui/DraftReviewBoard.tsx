"use client";

import { useState } from "react";
import { DraftStatusBadge, type SolutionDraft } from "@/entities/solution-draft";
import { Button } from "@/shared/ui";

type Props = {
  initialDrafts: SolutionDraft[];
};

export function DraftReviewBoard({ initialDrafts }: Props) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [selectedId, setSelectedId] = useState(initialDrafts[0].id);
  const selected = drafts.find((draft) => draft.id === selectedId) ?? drafts[0];

  const approve = () =>
    setDrafts((prev) =>
      prev.map((draft) => (draft.id === selected.id ? { ...draft, approved: true } : draft)),
    );

  return (
    <div className="grid items-start gap-10 xl:grid-cols-3 xl:gap-10">
      <ul className="flex min-w-0 flex-col gap-3">
        {drafts.map((draft) => {
          const isSelected = draft.id === selected.id;
          return (
            <li key={draft.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedId(draft.id)}
                className={`flex w-full cursor-pointer flex-col gap-3 rounded-lg border-2 p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                  isSelected
                    ? "border-primary-300 bg-primary-50"
                    : "border-transparent bg-secondary-50 hover:border-secondary-100"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-body-md text-secondary-600">{draft.model}</span>
                  <DraftStatusBadge approved={draft.approved} />
                </span>
                <span className="text-title-md text-black">{draft.title}</span>
                <span className="text-body-md text-secondary-700">
                  근거 {draft.sources.length}건 · {draft.date}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <section className="flex min-w-0 flex-col gap-8 rounded-lg bg-secondary-50 p-6 xl:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-body-md text-secondary-600">{selected.model}</p>
            <h2 className="text-title-lg text-black">{selected.title}</h2>
          </div>
          <DraftStatusBadge approved={selected.approved} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-3">
            <h3 className="text-title-md text-black">근거가 된 A/S 기록</h3>
            <ul className="flex flex-col gap-2">
              {selected.sources.map((source) => (
                <li key={source.id} className="flex flex-col gap-1 rounded-lg bg-white p-4">
                  <span className="font-mono text-body-md text-secondary-600">{source.id}</span>
                  <span className="text-body-md text-black">{source.summary}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <h3 className="text-title-md text-black">솔루션 초안</h3>
            <ol className="flex flex-col gap-2 rounded-lg bg-white p-5">
              {selected.steps.map((step, index) => (
                <li key={step} className="text-body-md text-black">
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t-2 border-secondary-100 pt-6">
          {selected.approved ? (
            <p aria-live="polite" className="text-body-md text-secondary-700">
              승인됐어요. 이 모델을 쓰는 사용 업체의 설비 화면에 보여요.
            </p>
          ) : (
            <>
              <Button variant="ghost" size="lg">
                수정
              </Button>
              <Button size="lg" onClick={approve}>
                승인하고 배포
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
