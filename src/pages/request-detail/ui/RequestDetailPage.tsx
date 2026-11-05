"use client";

import { AttachmentList } from "@/entities/attachment";
import {
  callReasonLabels,
  equipmentStateLabels,
  requestStatusLabels,
  UrgencyBadge,
} from "@/entities/service-call";
import { requestApi, useApi, type RequestDetailResponse } from "@/shared/api";
import { formatDateTime } from "@/shared/lib";
import { Badge, LoadState, PageHeading, PageMain, Panel } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  requestId: number;
};

const progress: RequestDetailResponse["status"][] = ["RECEIVED", "ASSIGNED", "COMPLETED"];

export function RequestDetailPage({ requestId }: Props) {
  const { data: request, error } = useApi(
    () => requestApi.get(requestId),
    `my-request:${requestId}`,
  );

  return (
    <>
      <AppHeader side="user" active="consult" />
      <PageMain>
        {request ? <RequestDetail request={request} /> : <LoadState error={error} />}
      </PageMain>
    </>
  );
}

function RequestDetail({ request }: { request: RequestDetailResponse }) {
  const step = progress.indexOf(request.status);
  const summary = [
    ["증상", request.aiSummary?.symptom],
    ["좁힌 원인", request.aiSummary?.cause],
    ["시도한 조치", request.aiSummary?.triedAction],
  ];

  return (
    <>
      <PageHeading
        back={{ href: "/consult", label: "호출 내역" }}
        title={request.equipment.name}
        titleAddon={<Badge tone="strong">{requestStatusLabels[request.status]}</Badge>}
        description={
          <span className="flex flex-wrap items-center gap-2 text-body-md">
            {request.requestNo} · {request.equipment.modelCode} · 호출{" "}
            {formatDateTime(request.createdAt)}
            <UrgencyBadge urgency={request.urgency} />
            {request.callReason && (
              <Badge tone="primary">{callReasonLabels[request.callReason]}</Badge>
            )}
          </span>
        }
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Panel tone="accent" title="신고 내용" className="gap-4">
            <dl className="flex flex-col gap-2.5 text-body-md">
              {[...summary, ["설비 상태", equipmentStateLabels[request.equipmentState]]].map(
                ([label, value]) => (
                  <div key={label} className="flex">
                    <dt className="w-25 shrink-0 text-secondary-600">{label}</dt>
                    <dd className="text-black">{value || "—"}</dd>
                  </div>
                ),
              )}
            </dl>
            <p className="rounded-lg border-2 border-primary-300 bg-white px-4 py-3 text-body-md whitespace-pre-line text-black">
              {request.symptomDetail}
            </p>
            {!!request.attachments?.length && <AttachmentList attachments={request.attachments} />}
          </Panel>
        </div>
        <aside className="flex shrink-0 flex-col gap-6 lg:w-90">
          <Panel title="진행 상황" className="gap-4">
            {request.status === "SELF_RESOLVED" ? (
              <p className="text-body-md text-secondary-700">
                엔지니어 방문 없이 해결된 건으로 처리됐어요.
              </p>
            ) : (
              <ol className="flex flex-col gap-3.5">
                {["접수", "엔지니어 배정", "수리 완료"].map((title, index) => (
                  <li key={title} className="flex items-center gap-3">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-label-md ${
                        index <= step
                          ? "bg-primary-500 text-white"
                          : "bg-primary-100 text-primary-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-label-lg ${index <= step ? "text-black" : "text-secondary-600"}`}
                    >
                      {title}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
          <Panel title="엔지니어 방문" className="gap-3">
            {request.engineer ? (
              <dl className="flex flex-col gap-2.5 text-body-md">
                {[
                  ["엔지니어", request.engineer.name],
                  ["연락처", request.engineer.phone],
                  ["방문 일정", request.visitAt ? formatDateTime(request.visitAt) : "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex">
                    <dt className="w-20 shrink-0 text-secondary-600">{label}</dt>
                    <dd className="text-black">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-body-sm text-secondary-700">
                엔지니어가 배정되면 방문 일정이 여기에 표시돼요.
              </p>
            )}
          </Panel>
          <Panel title="연락처" className="gap-3">
            <dl className="flex flex-col gap-2.5 text-body-md">
              {[
                ["신고자", `${request.contact.reporterName} · ${request.contact.reporterPhone}`],
                ["회사", request.contact.companyPhone],
              ].map(([label, value]) => (
                <div key={label} className="flex">
                  <dt className="w-20 shrink-0 text-secondary-600">{label}</dt>
                  <dd className="text-black">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </aside>
      </div>
    </>
  );
}
