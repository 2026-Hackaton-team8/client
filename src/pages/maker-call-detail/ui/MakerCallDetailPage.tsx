"use client";

import { useState } from "react";
import { RepairLevelBadge, repairLevelOf } from "@/entities/repair-record";
import {
  callReasonLabels,
  equipmentStateLabels,
  isVisitDue,
  requestStatusLabels,
  UrgencyBadge,
} from "@/entities/service-call";
import { AssignEngineerForm } from "@/features/assign-engineer";
import { errorMessage, makerApi, modelApi, useApi, type RequestDetailResponse } from "@/shared/api";
import { unityCodeFor } from "@/shared/config";
import { formatDateTime, formatMonthDay, toDotDate } from "@/shared/lib";
import {
  Badge,
  Button,
  ButtonLink,
  LoadState,
  PageHeading,
  PageMain,
  Panel,
  UnityViewer,
} from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  requestId: number;
};

export function MakerCallDetailPage({ requestId }: Props) {
  const call = useApi(() => makerApi.request(requestId), `request:${requestId}`);

  return (
    <>
      <AppHeader side="maker" active="calls" />
      <PageMain>
        {call.data ? (
          <CallDetail call={call.data} onChange={call.reload} />
        ) : (
          <LoadState error={call.error} />
        )}
      </PageMain>
    </>
  );
}

type CallDetailProps = {
  call: RequestDetailResponse;
  onChange: () => void;
};

function CallDetail({ call, onChange }: CallDetailProps) {
  const modelId = call.equipment.modelId;
  const model = useApi(() => modelApi.get(modelId), `model:${modelId}`);
  const histories = useApi(() => makerApi.modelHistories(modelId), `histories:${modelId}`);
  const [error, setError] = useState("");
  const visitDue = isVisitDue(call);
  const summary = [
    ["증상", call.aiSummary?.symptom],
    ["설비 상태", equipmentStateLabels[call.equipmentState]],
    ["좁힌 원인", call.aiSummary?.cause],
    ["시도한 조치", call.aiSummary?.triedAction],
  ];

  async function resolveBySelf() {
    setError("");
    try {
      await makerApi.resolveBySelf(call.id);
      onChange();
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  return (
    <>
      <PageHeading
        back={{ href: "/maker/calls", label: "호출 수신함" }}
        title={`${call.company.name} · ${call.equipment.name}`}
        description={
          <span className="flex flex-wrap items-center gap-2 text-body-md">
            {call.requestNo} · 모델 {call.equipment.modelCode} · 호출{" "}
            {formatDateTime(call.createdAt)}
            <UrgencyBadge urgency={call.urgency} />
            {call.callReason && <Badge tone="primary">{callReasonLabels[call.callReason]}</Badge>}
            <Badge>{requestStatusLabels[call.status]}</Badge>
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            {error && (
              <p role="alert" className="text-body-sm text-primary-600">
                {error}
              </p>
            )}
            {call.status === "RECEIVED" && (
              <Button variant="ghost" onClick={resolveBySelf}>
                자가 해결로 처리
              </Button>
            )}
            {visitDue && (
              <ButtonLink href={`/maker/records/new?call=${call.id}`}>수리 기록 작성</ButtonLink>
            )}
          </div>
        }
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Panel tone="accent" title="AI 상담 요약" className="gap-4">
            <dl className="flex flex-col gap-2.5 text-body-md">
              {summary.map(([label, value], index) => (
                <div key={label} className="flex">
                  <dt className="w-25 shrink-0 text-secondary-600">{label}</dt>
                  <dd
                    className={
                      index === summary.length - 1 ? "font-semibold text-primary-500" : "text-black"
                    }
                  >
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="rounded-lg border-2 border-primary-300 bg-white px-4 py-3 text-body-md whitespace-pre-line text-black">
              {call.symptomDetail}
            </p>
          </Panel>

          <Panel
            tone="plain"
            title={`${call.equipment.modelCode} 모델 수리 이력`}
            className="gap-1"
          >
            {histories.loading || histories.error ? (
              <LoadState error={histories.error} />
            ) : histories.data?.length === 0 ? (
              <p className="py-3.5 text-body-md text-secondary-600">아직 수리 이력이 없어요.</p>
            ) : (
              <ul>
                {histories.data?.slice(0, 3).map((record) => (
                  <li
                    key={record.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-secondary-100 py-3.5 text-body-md"
                  >
                    <span className="w-20 text-secondary-600">
                      {formatMonthDay(toDotDate(record.repairedAt))}
                    </span>
                    <span className="w-35 font-semibold text-black">
                      {record.part.name} {record.part.code}
                    </span>
                    <span className="min-w-0 flex-1 text-black">
                      {record.cause} → {record.solution}
                    </span>
                    <RepairLevelBadge level={repairLevelOf(record.difficulty)} />
                    {record.equipment.id === call.equipment.id ? (
                      <Badge tone="primary">이 설비</Badge>
                    ) : (
                      <Badge tone="neutral">다른 이용 기업</Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="pt-3 text-label-md font-normal text-secondary-600">
              다른 이용 기업의 같은 모델 이력도 함께 보여요.
            </p>
          </Panel>
        </div>

        <aside className="flex shrink-0 flex-col gap-6 lg:w-95">
          <Panel title="설비 위치" className="gap-3">
            <UnityViewer
              label={`${call.equipment.modelCode} 3D 모델`}
              equipmentCode={unityCodeFor(model.data)}
              className="h-80"
            />
            <dl className="flex flex-col gap-1.5 text-body-sm">
              {[
                ["위치", call.equipment.location],
                ["시리얼", call.equipment.serialNumber || "—"],
                ["신고자", `${call.contact.reporterName} · ${call.contact.reporterPhone}`],
                ["회사 연락처", call.contact.companyPhone],
              ].map(([label, value]) => (
                <div key={label} className="flex">
                  <dt className="w-20 shrink-0 text-secondary-600">{label}</dt>
                  <dd className="text-secondary-700">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          {call.status === "RECEIVED" && (
            <AssignEngineerForm requestId={call.id} onAssigned={onChange} />
          )}
          {call.status === "ASSIGNED" && call.engineer && (
            <VisitPanel
              callId={call.id}
              engineer={call.engineer.name}
              visitAt={call.visitAt}
              visited={visitDue}
            />
          )}
        </aside>
      </div>
    </>
  );
}

type VisitPanelProps = {
  callId: number;
  engineer: string;
  visitAt?: string;
  visited: boolean;
};

// The repair record only opens once the visit date has passed.
function VisitPanel({ callId, engineer, visitAt, visited }: VisitPanelProps) {
  return (
    <Panel
      title="엔지니어 방문"
      titleAddon={
        <Badge tone={visited ? "strong" : "primary"}>{visited ? "기록 대기" : "방문 예정"}</Badge>
      }
      className="gap-4"
    >
      <dl className="flex flex-col gap-2.5 text-body-md">
        <div className="flex">
          <dt className="w-20 shrink-0 text-secondary-600">엔지니어</dt>
          <dd className="text-black">{engineer}</dd>
        </div>
        <div className="flex">
          <dt className="w-20 shrink-0 text-secondary-600">방문 일정</dt>
          <dd className="text-black">{visitAt ? formatDateTime(visitAt) : "—"}</dd>
        </div>
      </dl>
      {visited ? (
        <>
          <p className="text-body-sm text-secondary-700">
            방문이 끝났어요. 수리 결과를 기록해 주세요.
          </p>
          <ButtonLink href={`/maker/records/new?call=${callId}`} block>
            수리 기록 작성
          </ButtonLink>
        </>
      ) : (
        <p className="text-body-sm text-secondary-700">
          방문일이 지나면 수리 기록을 작성할 수 있어요.
        </p>
      )}
    </Panel>
  );
}
