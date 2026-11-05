"use client";

import Link from "next/link";
import { useState } from "react";
import { serviceCalls, UrgencyBadge, type CallStatus } from "@/entities/service-call";
import { Chip, PageHeading } from "@/shared/ui";

const filters: { status: CallStatus; label: string }[] = [
  { status: "new", label: "새 호출" },
  { status: "assigned", label: "엔지니어 배정됨" },
  { status: "visited", label: "기록 대기" },
  { status: "done", label: "수리 완료" },
  { status: "self", label: "자가 해결" },
];

const columns = ["긴급도", "이용 기업", "설비 / 모델", "증상 요약", "호출 사유", "호출 시각"];

export function CallInbox() {
  const [status, setStatus] = useState<CallStatus>("new");
  const rows = serviceCalls.filter((call) => call.status === status);

  return (
    <>
      <PageHeading
        title="호출 수신함"
        description="AI 상담으로 해결되지 않아 담당자를 호출한 건이에요."
        action={
          <div role="group" aria-label="상태 필터" className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Chip
                key={filter.status}
                selected={status === filter.status}
                onClick={() => setStatus(filter.status)}
              >
                {filter.label} {serviceCalls.filter((call) => call.status === filter.status).length}
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
            {rows.map((call) => (
              <tr
                key={call.id}
                className={`border-b border-secondary-100 last:border-b-0 ${call.urgency === "high" ? "bg-primary-50" : ""}`}
              >
                <td className="px-6 py-4">
                  <UrgencyBadge urgency={call.urgency} />
                </td>
                <td className="px-6 py-4 text-label-lg text-black">{call.company}</td>
                <td className="px-6 py-4">
                  <p className="text-body-md text-black">{call.equipmentName}</p>
                  <p className="text-label-md font-normal text-secondary-600">{call.model}</p>
                </td>
                <td className="px-6 py-4 text-body-md text-black">{call.symptom}</td>
                <td className="px-6 py-4 text-body-md text-secondary-700">{call.reason}</td>
                <td className="px-6 py-4 text-body-sm whitespace-nowrap text-secondary-600">
                  {call.time}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/maker/calls/${call.id}`}
                    aria-label={`${call.company} ${call.equipmentName} 호출 열기`}
                    className="text-label-lg whitespace-nowrap text-primary-500 hover:text-primary-600"
                  >
                    열기 →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-6 py-10 text-center text-body-md text-secondary-600">
            해당하는 호출이 없어요.
          </p>
        )}
      </div>
    </>
  );
}
