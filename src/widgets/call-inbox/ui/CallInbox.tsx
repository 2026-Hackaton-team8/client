"use client";

import Link from "next/link";
import { useState } from "react";
import { callReasonLabels, requestStatusLabels, UrgencyBadge } from "@/entities/service-call";
import { makerApi, useApi, type RequestStatus } from "@/shared/api";
import { formatDateTime } from "@/shared/lib";
import { Chip, LoadState, PageHeading } from "@/shared/ui";

const statuses: RequestStatus[] = ["RECEIVED", "ASSIGNED", "COMPLETED", "SELF_RESOLVED"];

const columns = ["긴급도", "이용 기업", "설비 / 모델", "증상 요약", "호출 사유", "호출 시각"];

export function CallInbox() {
  const [status, setStatus] = useState<RequestStatus>("RECEIVED");
  const {
    data: inbox,
    error,
    loading,
  } = useApi(() => makerApi.inbox({ status, size: 100 }), `inbox:${status}`);
  const rows = inbox?.content ?? [];

  return (
    <>
      <PageHeading
        title="호출 수신함"
        description="AI 상담으로 해결되지 않아 담당자를 호출한 건이에요."
        action={
          <div role="group" aria-label="상태 필터" className="flex flex-wrap gap-2">
            {statuses.map((value) => (
              <Chip key={value} selected={status === value} onClick={() => setStatus(value)}>
                {requestStatusLabels[value]} {inbox?.counts[value] ?? ""}
              </Chip>
            ))}
          </div>
        }
      />
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
            {!loading &&
              rows.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-secondary-100 last:border-b-0 hover:bg-primary-50"
                >
                  <td className="px-6 py-4">
                    <UrgencyBadge urgency={call.urgency} />
                  </td>
                  <td className="px-6 py-4 text-label-lg text-black">{call.companyName}</td>
                  <td className="px-6 py-4">
                    <p className="text-body-md text-black">{call.equipmentName}</p>
                    <p className="text-label-md font-normal text-secondary-600">{call.modelCode}</p>
                  </td>
                  <td className="px-6 py-4 text-body-md text-black">{call.symptomSummary}</td>
                  <td className="px-6 py-4 text-body-md text-secondary-700">
                    {call.callReason ? callReasonLabels[call.callReason] : "—"}
                  </td>
                  <td className="px-6 py-4 text-body-sm whitespace-nowrap text-secondary-600">
                    {formatDateTime(call.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/maker/calls/${call.id}`}
                      aria-label={`${call.companyName} ${call.equipmentName} 호출 열기`}
                      className="text-label-lg whitespace-nowrap text-primary-500 hover:text-primary-600"
                    >
                      열기 →
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading || error ? (
          <LoadState error={error} />
        ) : (
          rows.length === 0 && (
            <p className="px-6 py-10 text-center text-body-md text-secondary-600">
              해당하는 호출이 없어요.
            </p>
          )
        )}
      </div>
    </>
  );
}
