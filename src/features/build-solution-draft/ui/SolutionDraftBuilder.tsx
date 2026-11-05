"use client";

import { useState } from "react";
import { RepairLevelBadge, type RepairRecord } from "@/entities/repair-record";
import type { SolutionDraft } from "@/entities/solution-draft";
import { formatShortDate } from "@/shared/lib";
import { Badge, Button, Panel, Select, TextArea, TextField } from "@/shared/ui";

type Props = {
  model: string;
  records: RepairRecord[];
  initialDraft?: SolutionDraft;
};

const periods = [
  { value: "2026.05.05", label: "최근 6개월" },
  { value: "2025.11.05", label: "최근 1년" },
];

export function SolutionDraftBuilder({ model, records, initialDraft }: Props) {
  const systems = [...new Set(records.map((record) => record.system))];
  const [system, setSystem] = useState(systems[0] ?? "");
  const [since, setSince] = useState(periods[0].value);
  const [selected, setSelected] = useState<string[]>(initialDraft?.evidence ?? []);
  const [draft, setDraft] = useState<SolutionDraft | undefined>(initialDraft);
  const [newSymptom, setNewSymptom] = useState("");
  const [notice, setNotice] = useState("");

  const visible = records.filter((record) => record.system === system && record.date >= since);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  // Draft generation is mocked: the AI result is the stored draft, rebuilt from the chosen records.
  function generate() {
    if (!initialDraft) return;
    setDraft({ ...initialDraft, system, evidence: selected, status: "pending" });
    setNotice("");
  }

  function update(patch: Partial<SolutionDraft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }

  function addSymptom() {
    const text = newSymptom.trim();
    if (!draft || !text) return;
    update({ symptoms: [...draft.symptoms, text] });
    setNewSymptom("");
  }

  const evidence = records.filter((record) => draft?.evidence.includes(record.id));

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <Panel tone="plain" title={`1. ${model} 수리 이력 조회`} className="shrink-0 gap-4 lg:w-140">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="부품 계통"
            options={systems.map((value) => ({ value, label: value }))}
            value={system}
            onChange={(event) => setSystem(event.target.value)}
          />
          <Select
            label="기간"
            options={periods}
            value={since}
            onChange={(event) => setSince(event.target.value)}
          />
        </div>
        <ul aria-label="수리 이력" className="overflow-hidden rounded-lg">
          {visible.map((record) => {
            const checked = selected.includes(record.id);
            return (
              <li key={record.id} className="border-b border-secondary-100 last:border-b-0">
                <label
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${checked ? "bg-primary-50" : "hover:bg-secondary-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(record.id)}
                    className="size-5 shrink-0 accent-primary-500"
                  />
                  <span className="w-10 text-body-sm text-secondary-600">
                    {formatShortDate(record.date)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-label-lg text-black">
                      {record.partName} {record.partCode}
                    </span>
                    <span className="text-body-sm text-secondary-700">
                      {record.cause} → {record.fix}
                    </span>
                  </span>
                  <RepairLevelBadge level={record.level} />
                </label>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between gap-3">
          <span className="text-label-lg text-primary-600">{selected.length}건 선택됨</span>
          <Button variant="strong" disabled={selected.length === 0} onClick={generate}>
            선택한 이력으로 초안 생성
          </Button>
        </div>
      </Panel>

      <Panel tone="outline" title="2. 초안 검토" className="min-w-0 flex-1 gap-5">
        {!draft ? (
          <p className="text-body-md text-secondary-600">
            왼쪽에서 수리 이력을 골라 초안을 만들어 주세요.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-heading-sm font-bold text-black">{draft.title}</h3>
                {draft.status === "approved" ? (
                  <Badge tone="strong">승인됨 · AI 상담 반영</Badge>
                ) : (
                  <Badge tone="primary">AI 초안 · 검토 대기</Badge>
                )}
              </div>
              <p className="text-body-sm text-secondary-600">
                {draft.system} 계통 · 근거 이력 {draft.evidence.length}건 ·{" "}
                {formatShortDate(draft.createdAt)} 생성
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-label-lg text-black">적용 증상</h4>
              <div className="flex flex-wrap items-center gap-1.5">
                {draft.symptoms.map((symptom) => (
                  <Badge key={symptom}>{symptom}</Badge>
                ))}
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    addSymptom();
                  }}
                  className="w-40"
                >
                  <TextField
                    label="증상 추가"
                    hideLabel
                    value={newSymptom}
                    onChange={(event) => setNewSymptom(event.target.value)}
                    placeholder="+ 추가"
                    className="py-1"
                  />
                </form>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-label-lg text-black">이용 기업이 직접 해볼 단계</h4>
              <ol className="flex flex-col gap-2">
                {draft.steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 rounded-lg border-2 border-secondary-100 bg-white pl-4"
                  >
                    <span className="text-label-lg text-primary-500">{index + 1}</span>
                    <input
                      aria-label={`${index + 1}단계`}
                      value={step}
                      onChange={(event) =>
                        update({
                          steps: draft.steps.map((item, i) =>
                            i === index ? event.target.value : item,
                          ),
                        })
                      }
                      className="min-w-0 flex-1 rounded-lg py-3 pr-4 text-body-md text-black focus:outline-none"
                    />
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => update({ steps: [...draft.steps, ""] })}
                className="cursor-pointer self-start text-body-sm font-semibold text-primary-500 hover:text-primary-600"
              >
                + 단계 추가
              </button>
            </div>

            <TextArea
              label="해결되지 않으면"
              rows={2}
              value={draft.fallback}
              onChange={(event) => update({ fallback: event.target.value })}
            />

            <div className="flex flex-col gap-2">
              <h4 className="text-label-lg text-black">근거 이력</h4>
              <div className="flex flex-wrap gap-1.5">
                {evidence.map((record) => (
                  <Badge key={record.id} tone="primary">
                    {record.id} · {formatShortDate(record.date)}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="rounded-lg bg-primary-50 px-4 py-3 text-body-sm text-primary-600">
              승인하면 {model} AI 상담이 이 솔루션을 답변 데이터로 써요. 승인 후에도 수정하거나 내릴
              수 있어요.
            </p>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {notice && (
                <p role="status" className="mr-auto text-body-sm text-secondary-700">
                  {notice}
                </p>
              )}
              <Button variant="ghost" onClick={generate}>
                다시 생성
              </Button>
              <Button variant="soft" onClick={() => setNotice("수정한 초안을 저장했어요.")}>
                수정 저장
              </Button>
              <Button
                disabled={draft.status === "approved"}
                onClick={() => {
                  update({ status: "approved" });
                  setNotice(`승인했어요. 이제 ${model} AI 상담이 이 솔루션으로 답해요.`);
                }}
              >
                승인하고 AI 상담에 반영
              </Button>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
