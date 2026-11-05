"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ManualEntry } from "@/entities/model-manual";
import { Button, ButtonLink, Panel, TextArea, TextField } from "@/shared/ui";

type Props = {
  model: string;
};

type EntryDraft = ManualEntry & { key: number };

let nextKey = 0;
const emptyEntry = (): EntryDraft => ({ key: nextKey++, problem: "", solution: "" });

export function RegisterManualForm({ model }: Props) {
  const router = useRouter();
  const [entries, setEntries] = useState<EntryDraft[]>(() => [emptyEntry()]);
  const backHref = `/maker/models/${model}`;

  function update(key: number, patch: Partial<ManualEntry>) {
    setEntries((current) =>
      current.map((entry) => (entry.key === key ? { ...entry, ...patch } : entry)),
    );
  }

  function remove(key: number) {
    setEntries((current) => current.filter((entry) => entry.key !== key));
  }

  // Saving is mocked: there's no API yet, so we just go back to the model.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(backHref);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Panel tone="plain" className="gap-6">
        <TextField
          label="매뉴얼 제목"
          name="title"
          placeholder="예: 배수 계통 점검 매뉴얼"
          required
        />

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
          등록하면 {model} AI 상담이 이 매뉴얼을 답변 데이터로 써요.
        </p>

        <div className="flex justify-end gap-2">
          <ButtonLink href={backHref} variant="ghost">
            취소
          </ButtonLink>
          <Button type="submit" variant="strong">
            매뉴얼 등록
          </Button>
        </div>
      </Panel>
    </form>
  );
}
