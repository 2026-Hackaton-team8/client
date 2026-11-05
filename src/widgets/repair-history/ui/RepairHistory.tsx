"use client";

import Link from "next/link";
import { useState } from "react";
import { RepairLevelBadge, repairLevelOf } from "@/entities/repair-record";
import { isVisitDue } from "@/entities/service-call";
import { makerApi, useApi } from "@/shared/api";
import { formatDateTime, toDotDate } from "@/shared/lib";
import { Button, ButtonLink, LoadState, PageHeading, Panel, TextField } from "@/shared/ui";

const columns = [
  { label: "접수 번호", width: "w-25" },
  { label: "수리 일자", width: "w-25" },
  { label: "설비 모델", width: "" },
  { label: "부품", width: "w-40" },
  { label: "원인 → 조치", width: "w-55" },
  { label: "조치 구분", width: "w-25" },
];

const cell = "px-6 py-3.5";

// There's no maker-wide history endpoint, so gather every model's history.
async function loadRecords() {
  const models = await makerApi.models();
  const lists = await Promise.all(models.map((model) => makerApi.modelHistories(model.id)));
  return lists.flat().sort((a, b) => b.repairedAt.localeCompare(a.repairedAt));
}

// Assigned calls whose visit time has passed are waiting for their repair record.
async function loadPending() {
  const inbox = await makerApi.inbox({ status: "ASSIGNED", size: 100 });
  const calls = await Promise.all(inbox.content.map((call) => makerApi.request(call.id)));
  return calls.filter(isVisitDue);
}

export function RepairHistory() {
  const [query, setQuery] = useState("");
  // Records are written per call, so 수리 기록 작성 opens the calls waiting for one.
  const [showPending, setShowPending] = useState(false);
  const records = useApi(loadRecords, "maker-records");
  const { data: pending = [] } = useApi(loadPending, "pending-records");
  const keyword = query.trim().toLowerCase();
  const all = records.data ?? [];
  const rows = keyword
    ? all.filter((record) =>
        [record.requestNo, record.equipment.modelCode, record.part.code, record.part.name].some(
          (value) => value.toLowerCase().includes(keyword),
        ),
      )
    : all;

  return (
    <>
      <PageHeading
        title="수리 이력"
        description="처리한 A/S 수리 기록을 모아 보고, 기록을 열어 상세 내용을 확인해요."
        action={
          <div className="flex w-full items-center gap-4 sm:w-auto">
            <div className="min-w-0 flex-1 sm:w-80 sm:flex-none">
              <TextField
                label="수리 이력 검색"
                hideLabel
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="접수 번호, 모델, 부품으로 검색"
              />
            </div>
            <Button
              variant="strong"
              aria-expanded={showPending}
              aria-controls="pending-records"
              onClick={() => setShowPending((value) => !value)}
            >
              수리 기록 작성
            </Button>
          </div>
        }
      />

      {showPending && (
        <Panel tone="accent" title={`기록 대기 ${pending.length}건`} className="gap-3">
          <p id="pending-records" className="text-body-sm text-secondary-700">
            {pending.length > 0
              ? "엔지니어 방문이 끝난 호출이에요. 수리 결과를 기록해 주세요."
              : "기록을 기다리는 호출이 없어요. 엔지니어 방문이 끝나면 여기에 나와요."}
          </p>
          <ul className="flex flex-col gap-2">
            {pending.map((call) => (
              <li
                key={call.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-white px-4 py-3"
              >
                <span className="text-label-lg text-black">{call.requestNo}</span>
                <span className="min-w-0 flex-1 text-body-md text-black">
                  {call.company.name} · {call.equipment.name} · {call.equipment.modelCode}
                </span>
                {call.visitAt && (
                  <span className="text-body-sm text-secondary-600">
                    {formatDateTime(call.visitAt)} 방문 · {call.engineer?.name}
                  </span>
                )}
                <ButtonLink href={`/maker/records/new?call=${call.id}`} size="sm">
                  수리 기록 작성
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse text-left">
          <thead>
            <tr className="border-b border-secondary-100 text-label-md text-secondary-600">
              {columns.map((column) => (
                <th
                  key={column.label}
                  scope="col"
                  className={`${cell} ${column.width} font-semibold`}
                >
                  {column.label}
                </th>
              ))}
              <th scope="col" className={`${cell} w-15`}>
                <span className="sr-only">열기</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((record) => (
              <tr key={record.id} className="border-b border-secondary-100 last:border-b-0">
                <td className={`${cell} text-label-lg text-black`}>{record.requestNo}</td>
                <td className={`${cell} text-body-sm whitespace-nowrap text-secondary-600`}>
                  {toDotDate(record.repairedAt)}
                </td>
                <td className={cell}>
                  <div className="flex items-center gap-3.5">
                    <span aria-hidden className="size-12 shrink-0 rounded-lg bg-secondary-100" />
                    <span className="flex flex-col">
                      <span className="text-title-md text-black">{record.equipment.modelCode}</span>
                      <span className="text-body-sm text-secondary-600">
                        {record.equipment.modelName}
                      </span>
                    </span>
                  </div>
                </td>
                <td className={cell}>
                  <p className="text-body-md text-black">{record.part.name}</p>
                  <p className="text-body-sm text-secondary-600">{record.part.code}</p>
                </td>
                <td className={`${cell} text-body-md text-black`}>
                  {record.cause} → {record.solution}
                </td>
                <td className={cell}>
                  <RepairLevelBadge level={repairLevelOf(record.difficulty)} />
                </td>
                <td className={cell}>
                  <Link
                    href={`/maker/calls/${record.requestId}`}
                    aria-label={`${record.requestNo} 호출 열기`}
                    className="text-label-lg whitespace-nowrap text-primary-500 hover:text-primary-600"
                  >
                    열기 →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.loading || records.error ? (
          <LoadState error={records.error} />
        ) : (
          rows.length === 0 && (
            <p className="py-12 text-center text-body-md text-secondary-600">
              {keyword ? "검색 결과가 없어요." : "아직 수리 이력이 없어요."}
            </p>
          )
        )}
      </div>
    </>
  );
}
