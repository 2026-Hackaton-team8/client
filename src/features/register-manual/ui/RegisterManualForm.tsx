"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { loadManual } from "@/entities/model-manual";
import { errorMessage, makerApi, type ManualSection } from "@/shared/api";
import { Button, ButtonLink, Panel, TextArea } from "@/shared/ui";

type Props = {
  modelId: number;
  modelCode: string;
};

type ManualEntry = { problem: string; solution: string };
type EntryDraft = ManualEntry & { key: number };

let nextKey = 0;
const emptyEntry = (): EntryDraft => ({ key: nextKey++, problem: "", solution: "" });

// Each problem/solution pair becomes one troubleshooting section of the model's manual.
function toSection(entry: ManualEntry, index: number): ManualSection {
  return {
    id: `ts-${Date.now().toString(36)}-${index}`,
    title: entry.problem.trim().slice(0, 200),
    type: "TROUBLESHOOTING",
    symptoms: [entry.problem.trim()],
    content: entry.solution.trim(),
  };
}

export function RegisterManualForm({ modelId, modelCode }: Props) {
  const router = useRouter();
  const [entries, setEntries] = useState<EntryDraft[]>(() => [emptyEntry()]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const backHref = `/maker/models/${modelId}`;

  function update(key: number, patch: Partial<ManualEntry>) {
    setEntries((current) =>
      current.map((entry) => (entry.key === key ? { ...entry, ...patch } : entry)),
    );
  }

  function remove(key: number) {
    setEntries((current) => current.filter((entry) => entry.key !== key));
  }

  // The manual is saved whole, so append the new sections to what's already there.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const manual = await loadManual(modelId);
      await makerApi.updateManual(modelId, {
        version: manual.version,
        sections: [...manual.sections, ...entries.map(toSection)],
      });
      router.push(backHref);
    } catch (caught) {
      setError(errorMessage(caught));
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Panel tone="plain" className="gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-label-lg text-black">문제 상황 · 해결 방안</h2>
            <span className="text-body-sm text-secondary-600">{entries.length}쌍</span>
          </div>
          <ol className="flex flex-col gap-3">
            {entries.map((entry, index) => (
              <li
                key={entry.key}
                className="flex flex-col gap-4 rounded-lg border-2 border-secondary-100 bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-label-lg text-primary-500">{index + 1}</span>
                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(entry.key)}
                      aria-label={`${index + 1}번 문제·해결 삭제`}
                      className="cursor-pointer text-body-sm font-semibold text-secondary-600 hover:text-black"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextArea
                    label="문제 상황"
                    rows={3}
                    required
                    maxLength={200}
                    value={entry.problem}
                    onChange={(event) => update(entry.key, { problem: event.target.value })}
                    placeholder="예: 탈수가 안 되고 통에 물이 남아 있어요."
                  />
                  <TextArea
                    label="해결 방안"
                    rows={3}
                    required
                    value={entry.solution}
                    onChange={(event) => update(entry.key, { solution: event.target.value })}
                    placeholder="예: 전원을 끄고 배수 필터를 빼서 이물질을 없애요."
                  />
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setEntries((current) => [...current, emptyEntry()])}
            className="cursor-pointer rounded-lg border-2 border-dashed border-secondary-200 py-3 text-label-lg text-primary-500 hover:border-primary-300 hover:bg-primary-50"
          >
            + 문제·해결 추가
          </button>
        </div>

        <p className="rounded-lg bg-primary-50 px-4 py-3 text-body-sm text-primary-600">
          등록하면 {modelCode || "이 모델"} AI 상담이 이 매뉴얼을 답변 데이터로 써요.
        </p>

        <div className="flex items-center justify-end gap-2">
          {error && (
            <p role="alert" className="mr-auto text-body-sm text-primary-600">
              {error}
            </p>
          )}
          <ButtonLink href={backHref} variant="ghost">
            취소
          </ButtonLink>
          <Button type="submit" variant="strong" disabled={pending}>
            {pending ? "등록하는 중…" : "매뉴얼 등록"}
          </Button>
        </div>
      </Panel>
    </form>
  );
}
