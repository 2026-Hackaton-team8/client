"use client";

import { useState } from "react";
import {
  RequestStatusBadge,
  requestStatusLabels,
  type AsRequest,
  type RequestStatus,
} from "@/entities/as-request";
import { HistoryList } from "@/entities/equipment";
import { Button, Chip, TextArea } from "@/shared/ui";

type Props = {
  initialRequests: AsRequest[];
};

type Filter = "all" | RequestStatus;

const filters: Filter[] = ["all", "received", "progress", "done"];

export function RequestBoard({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(initialRequests[0].id);
  const [draftReport, setDraftReport] = useState("");

  const rows = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const selected = requests.find((r) => r.id === selectedId) ?? requests[0];

  const update = (patch: Partial<AsRequest>) =>
    setRequests((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...patch } : r)));

  const select = (id: string) => {
    setSelectedId(id);
    setDraftReport("");
  };

  const finish = () => {
    update({ status: "done", report: draftReport.trim() || "원인과 조치 내용을 적지 않았어요." });
    setDraftReport("");
  };

  return (
    <div className="grid items-start gap-10 xl:grid-cols-5 xl:gap-10">
      <section className="flex min-w-0 flex-col gap-6 xl:col-span-3">
        <div role="group" aria-label="상태 필터" className="flex flex-wrap gap-2">
          {filters.map((key) => {
            const count =
              key === "all" ? requests.length : requests.filter((r) => r.status === key).length;
            return (
              <Chip key={key} selected={filter === key} onClick={() => setFilter(key)}>
                {key === "all" ? "전체" : requestStatusLabels[key]} {count}
              </Chip>
            );
          })}
        </div>
        <ul className="flex flex-col gap-3">
          {rows.map((request) => {
            const isSelected = request.id === selected.id;
            return (
              <li key={request.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => select(request.id)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-6 rounded-lg border-2 p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                    isSelected
                      ? "border-primary-300 bg-primary-50"
                      : "border-transparent bg-secondary-50 hover:border-secondary-100"
                  }`}
                >
                  <span className="flex min-w-0 flex-col gap-2">
                    <span className="font-mono text-body-md text-secondary-600">{request.id}</span>
                    <span className="text-title-md text-black">{request.equipment}</span>
                    <span className="text-body-md text-secondary-700">
                      {request.part} · {request.company}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-3">
                    <RequestStatusBadge status={request.status} />
                    <span className="text-body-md text-secondary-600">{request.date}</span>
                  </span>
                </button>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="py-5 text-body-md text-secondary-600">해당하는 요청이 없어요.</li>
          )}
        </ul>
      </section>

      <aside className="flex min-w-0 flex-col gap-8 rounded-lg bg-secondary-50 p-6 xl:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-body-md text-secondary-600">{selected.id}</p>
            <h2 className="text-title-lg text-black">{selected.equipment}</h2>
            <p className="text-body-md text-secondary-700">
              {selected.company} · {selected.date} 접수
            </p>
          </div>
          <RequestStatusBadge status={selected.status} />
        </div>

        <section className="flex flex-col gap-3 rounded-lg bg-white p-5">
          <h3 className="text-label-lg text-secondary-700">상담 내용</h3>
          <div className="flex flex-wrap gap-2">
            {selected.symptoms.map((symptom) => (
              <span key={symptom} className="rounded-md bg-primary-100 px-2 py-1 text-label-md">
                {symptom}
              </span>
            ))}
          </div>
          <p className="text-body-md text-black">{selected.description}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-title-md text-black">해당 파트의 A/S 기록 · {selected.part}</h3>
          <div className="rounded-lg bg-white">
            <HistoryList items={selected.history} emptyText="이 파트의 이전 기록이 없어요." />
          </div>
        </section>

        <section className="flex flex-col gap-4 border-t-2 border-secondary-100 pt-6">
          {selected.status === "received" && (
            <>
              <p className="text-body-md text-secondary-700">
                진행을 시작하면 사용 업체에 &lsquo;진행 중&rsquo;으로 보여요.
              </p>
              <Button block size="lg" onClick={() => update({ status: "progress" })}>
                진행 시작
              </Button>
            </>
          )}
          {selected.status === "progress" && (
            <>
              <TextArea
                label="짧은 A/S 보고"
                placeholder="원인과 조치 내용을 적어 주세요."
                hint="제출하면 설비 수리 내역에 남고, 솔루션 초안의 근거가 돼요."
                value={draftReport}
                onChange={(event) => setDraftReport(event.target.value)}
              />
              <Button block size="lg" onClick={finish}>
                보고 제출하고 완료
              </Button>
            </>
          )}
          {selected.status === "done" && (
            <>
              <h3 className="text-label-lg text-secondary-700">A/S 보고</h3>
              <p className="text-body-md whitespace-pre-line text-black">{selected.report}</p>
            </>
          )}
        </section>
      </aside>
    </div>
  );
}
