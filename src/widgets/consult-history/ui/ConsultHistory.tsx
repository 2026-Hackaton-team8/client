"use client";

import Link from "next/link";
import { useState } from "react";
import { requestStatusLabels, UrgencyBadge } from "@/entities/service-call";
import { requestApi, useApi, type RequestStatus } from "@/shared/api";
import { formatDateTime } from "@/shared/lib";
import { Badge, Chip, LoadState, PageHeading } from "@/shared/ui";

type Filter = "all" | RequestStatus;

const filters: Filter[] = ["all", "RECEIVED", "ASSIGNED", "COMPLETED", "SELF_RESOLVED"];

export function ConsultHistory() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data: requests = [], error, loading } = useApi(requestApi.list, "my-requests");
  const count = (item: Filter) =>
    item === "all" ? requests.length : requests.filter((r) => r.status === item).length;
  const rows = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <>
      <PageHeading
        title="호출 내역"
        description="담당자를 호출한 건이에요. 항목을 누르면 진행 상황을 볼 수 있어요."
        action={
          <div role="group" aria-label="상태 필터" className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <Chip key={item} selected={filter === item} onClick={() => setFilter(item)}>
                {item === "all" ? "전체" : requestStatusLabels[item]} {count(item)}
              </Chip>
            ))}
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-collapse text-left">
          <thead>
            <tr className="border-b border-secondary-100 text-label-md text-secondary-600">
              <th scope="col" className="w-60 px-6 py-3.5 font-semibold">
                설비
              </th>
              <th scope="col" className="px-6 py-3.5 font-semibold">
                증상
              </th>
              <th scope="col" className="w-24 px-6 py-3.5 font-semibold">
                긴급도
              </th>
              <th scope="col" className="w-34 px-6 py-3.5 font-semibold">
                상태
              </th>
              <th scope="col" className="w-40 px-6 py-3.5 font-semibold">
                호출일
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              rows.map((request) => (
                <tr
                  key={request.id}
                  className="relative border-b border-secondary-100 last:border-b-0 hover:bg-secondary-50"
                >
                  <td className="px-6 py-4.5">
                    <p className="text-title-md text-black">{request.equipmentName}</p>
                    <p className="text-body-sm text-secondary-600">
                      {request.modelCode} · {request.requestNo}
                    </p>
                  </td>
                  <td className="px-6 py-4.5 text-body-md text-black">
                    <Link
                      href={`/requests/${request.id}`}
                      className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                      {request.symptomSummary}
                    </Link>
                  </td>
                  <td className="px-6 py-4.5">
                    <UrgencyBadge urgency={request.urgency} />
                  </td>
                  <td className="px-6 py-4.5">
                    <Badge tone={request.status === "RECEIVED" ? "strong" : "neutral"}>
                      {requestStatusLabels[request.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4.5 text-body-sm text-secondary-600">
                    {formatDateTime(request.createdAt)}
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
