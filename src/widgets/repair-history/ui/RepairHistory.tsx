"use client";

import Link from "next/link";
import { useState } from "react";
import { findModel } from "@/entities/equipment-model";
import { RepairLevelBadge, repairRecords } from "@/entities/repair-record";
import { findServiceCall, serviceCalls } from "@/entities/service-call";
import { ButtonLink, PageHeading, Panel, TextField } from "@/shared/ui";

const columns = ["접수 번호", "수리 일자", "설비 모델", "부품", "원인 → 조치", "조치 구분"];

export function RepairHistory() {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const rows = keyword
    ? repairRecords.filter((record) =>
        [record.id, record.model, record.partCode, record.partName].some((value) =>
          value.toLowerCase().includes(keyword),
        ),
      )
    : repairRecords;
  const pending = serviceCalls.filter((call) => call.status === "visited");

  return (
    <>
      <PageHeading
        title="수리 이력"
        description="처리한 A/S 수리 기록을 모아 보고, 기록을 열어 상세 내용을 확인해요."
        action={
          <div className="w-full sm:w-80">
            <TextField
              label="수리 이력 검색"
              hideLabel
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="접수 번호, 모델, 부품으로 검색"
            />
          </div>
        }
      />

      {pending.length > 0 && (
        <Panel tone="accent" title={`기록 대기 ${pending.length}건`} className="gap-3">
          <p className="text-body-sm text-secondary-700">
            엔지니어 방문이 끝난 호출이에요. 수리 결과를 기록해 주세요.
          </p>
          <ul className="flex flex-col gap-2">
            {pending.map((call) => (
              <li
                key={call.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-white px-4 py-3"
              >
                <span className="text-label-lg text-black">{call.id}</span>
                <span className="min-w-0 flex-1 text-body-md text-black">
                  {call.company} · {call.equipmentName} · {call.model}
                </span>
                {call.visit && (
                  <span className="text-body-sm text-secondary-600">
                    {call.visit.date} 방문 · {call.visit.engineer}
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
                <th key={column} scope="col" className="px-6 py-3.5 font-semibold">
                  {column}
                </th>
              ))}
              <th scope="col" className="px-6 py-3.5">
                <span className="sr-only">열기</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((record) => (
              <tr key={record.id} className="border-b border-secondary-100 last:border-b-0">
                <td className="px-6 py-4 text-label-lg text-black">{record.id}</td>
                <td className="px-6 py-4 text-body-sm whitespace-nowrap text-secondary-600">
                  {record.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <span aria-hidden className="size-12 shrink-0 rounded-lg bg-secondary-100" />
                    <span className="flex flex-col">
                      <span className="text-title-md text-black">{record.model}</span>
                      <span className="text-body-sm text-secondary-600">
                        {findModel(record.model)?.name}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-body-md text-black">{record.partName}</p>
                  <p className="text-body-sm text-secondary-600">{record.partCode}</p>
                </td>
                <td className="px-6 py-4 text-body-md text-black">
                  {record.cause} → {record.fix}
                </td>
                <td className="px-6 py-4">
                  <RepairLevelBadge level={record.level} />
                </td>
                <td className="px-6 py-4">
                  {findServiceCall(record.id) && (
                    <Link
                      href={`/maker/calls/${record.id}`}
                      aria-label={`${record.id} 호출 열기`}
                      className="text-label-lg whitespace-nowrap text-primary-500 hover:text-primary-600"
                    >
                      열기 →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-12 text-center text-body-md text-secondary-600">검색 결과가 없어요.</p>
        )}
      </div>
    </>
  );
}
