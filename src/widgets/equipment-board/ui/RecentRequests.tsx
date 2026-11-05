"use client";

import Link from "next/link";
import { requestStatusLabels } from "@/entities/service-call";
import { requestApi, useApi } from "@/shared/api";
import { formatDateTime } from "@/shared/lib";
import { Badge, LoadState, Panel } from "@/shared/ui";

export function RecentRequests() {
  const { data: requests, error, loading } = useApi(requestApi.list, "my-requests");

  return (
    <aside className="shrink-0 lg:w-85">
      <Panel tone="plain" title="최근 호출" className="gap-1">
        {loading || error ? (
          <LoadState error={error} />
        ) : requests?.length === 0 ? (
          <p className="py-4 text-body-sm text-secondary-600">아직 담당자를 호출한 적이 없어요.</p>
        ) : (
          <ul className="flex flex-col">
            {requests?.slice(0, 5).map((request) => (
              <li key={request.id} className="border-b border-secondary-100 py-4">
                <Link
                  href={`/requests/${request.id}`}
                  className="group flex flex-col gap-1.5 focus-visible:outline-2 focus-visible:outline-primary-500"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-label-lg text-black group-hover:text-primary-600">
                      {request.equipmentName}
                    </span>
                    <Badge tone={request.status === "RECEIVED" ? "accent" : "neutral"}>
                      {requestStatusLabels[request.status]}
                    </Badge>
                  </span>
                  <span className="text-body-sm text-secondary-700">{request.symptomSummary}</span>
                  <span className="text-label-md font-normal text-secondary-600">
                    {request.requestNo} · {formatDateTime(request.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/consult" className="pt-3 text-body-sm text-secondary-700 hover:text-black">
          더보기
        </Link>
      </Panel>
    </aside>
  );
}
