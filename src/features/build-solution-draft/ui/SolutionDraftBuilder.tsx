"use client";

import { useState } from "react";
import { RepairLevelBadge, repairLevelOf } from "@/entities/repair-record";
import type { SolutionDraft } from "@/entities/solution-draft";
import { errorMessage, type RepairHistoryResponse } from "@/shared/api";
import { formatShortDate, toDotDate } from "@/shared/lib";
import { Badge, Button, Panel, Select, TextArea, TextField } from "@/shared/ui";

type Props = {
  model: string;
  records: RepairHistoryResponse[];
  // Saves the approved draft so AI consultation can answer with it.
  onApprove: (draft: SolutionDraft) => Promise<void>;
};

function monthsAgo(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
}

const periods = [
  { value: monthsAgo(6), label: "최근 6개월" },
  { value: monthsAgo(12), label: "최근 1년" },
  { value: "0000-00-00", label: "전체" },
];

const unique = (values: string[]) =>
  [...new Set(values.map((value) => value.trim()))].filter(Boolean);

// No drafting API yet, so the draft is assembled from the chosen records: their causes become
// symptoms and the fixes users could do themselves become steps.
function buildDraft(part: string, records: RepairHistoryResponse[]): SolutionDraft {
  const selfFixes = records.filter((record) => record.difficulty === "SELF");
  return {
    id: `draft-${Date.now()}`,
    model: records[0]?.equipment.modelCode ?? "",
    title: `${part} 문제가 생겼을 때`,
    system: part,
    symptoms: unique(records.map((record) => record.cause)),
    steps: unique((selfFixes.length ? selfFixes : records).map((record) => record.solution)),
    fallback: "해결되지 않으면 담당자를 호출해 주세요.",
    evidence: records.map((record) => String(record.id)),
    status: "pending",
    createdAt: toDotDate(new Date().toISOString()),
  };
}

export function SolutionDraftBuilder({ model, records, onApprove }: Props) {
  const parts = unique(records.map((record) => record.part.name));
  const [part, setPart] = useState(parts[0] ?? "");
  const [since, setSince] = useState(periods[0].value);
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState<SolutionDraft>();
  const [newSymptom, setNewSymptom] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  const visible = records.filter(
    (record) => record.part.name === part && record.repairedAt >= since,
  );

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function generate() {
    const chosen = records.filter((record) => selected.includes(String(record.id)));
    if (!chosen.length) return;
    setDraft(buildDraft(part, chosen));
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

  async function approve() {
    if (!draft) return;
    setPending(true);
    setNotice("");
    try {
      const cleaned = { ...draft, steps: draft.steps.filter((step) => step.trim()) };
      await onApprove(cleaned);
      setDraft({ ...cleaned, status: "approved" });
      setNotice(`승인했어요. ${model} 매뉴얼에 추가돼 AI 상담이 이 솔루션으로 답해요.`);
    } catch (caught) {
      setNotice(errorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  const evidence = records.filter((record) => draft?.evidence.includes(String(record.id)));

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <Panel tone="plain" title={`1. ${model} 수리 이력 조회`} className="shrink-0 gap-4 lg:w-140">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="부품"
            options={parts.map((value) => ({ value, label: value }))}
            value={part}
            onChange={(event) => setPart(event.target.value)}
            disabled={parts.length === 0}
          />
          <Select
            label="기간"
            options={periods}
            value={since}
            onChange={(event) => setSince(event.target.value)}
          />
        </div>
        <ul aria-label="수리 이력" className="overflow-hidden rounded-lg">
          {visible.length === 0 && (
            <li className="px-4 py-3 text-body-md text-secondary-600">
              {records.length === 0
                ? "아직 이 모델의 수리 이력이 없어요."
                : "이 기간에 해당하는 이력이 없어요."}
            </li>
          )}
          {visible.map((record) => {
            const id = String(record.id);
            const checked = selected.includes(id);
            return (
              <li key={record.id} className="border-b border-secondary-100 last:border-b-0">
                <label
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${checked ? "bg-primary-50" : "hover:bg-secondary-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(id)}
                    className="size-5 shrink-0 accent-primary-500"
                  />
                  <span className="w-10 text-body-sm text-secondary-600">
                    {formatShortDate(toDotDate(record.repairedAt))}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-label-lg text-black">
                      {record.part.name} {record.part.code}
                    </span>
                    <span className="text-body-sm text-secondary-700">
                      {record.cause} → {record.solution}
                    </span>
                  </span>
                  <RepairLevelBadge level={repairLevelOf(record.difficulty)} />
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
                <TextField
                  label="제목"
                  hideLabel
                  value={draft.title}
                  maxLength={200}
                  onChange={(event) => update({ title: event.target.value })}
                  className="text-heading-sm font-bold"
                />
                {draft.status === "approved" ? (
                  <Badge tone="strong">승인됨 · AI 상담 반영</Badge>
                ) : (
                  <Badge tone="primary">초안 · 검토 대기</Badge>
                )}
              </div>
              <p className="text-body-sm text-secondary-600">
                {draft.system} · 근거 이력 {draft.evidence.length}건 ·{" "}
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
              required
              value={draft.fallback}
              onChange={(event) => update({ fallback: event.target.value })}
            />

            <div className="flex flex-col gap-2">
              <h4 className="text-label-lg text-black">근거 이력</h4>
              <div className="flex flex-wrap gap-1.5">
                {evidence.map((record) => (
                  <Badge key={record.id} tone="primary">
                    {record.requestNo} · {formatShortDate(toDotDate(record.repairedAt))}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="rounded-lg bg-primary-50 px-4 py-3 text-body-sm text-primary-600">
              승인하면 {model} 매뉴얼의 문제 해결 항목으로 저장되고, AI 상담이 이 솔루션을 답변
              데이터로 써요. 초안은 승인하기 전까지 이 화면에만 남아요.
            </p>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {notice && (
                <p role="status" className="mr-auto text-body-sm text-secondary-700">
                  {notice}
                </p>
              )}
              <Button variant="ghost" onClick={generate} disabled={pending}>
                다시 생성
              </Button>
              <Button
                disabled={draft.status === "approved" || pending || !draft.fallback.trim()}
                onClick={approve}
              >
                {pending ? "저장하는 중…" : "승인하고 AI 상담에 반영"}
              </Button>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
