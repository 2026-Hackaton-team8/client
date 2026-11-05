"use client";

import { useState } from "react";
import { AttachmentList } from "@/entities/attachment";
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
  // Mesh names come from the parts list; repair records only carry the part id and code.
  const parts = useApi(() => modelApi.parts(modelId), `parts:${modelId}`);
  const repaired = histories.data?.find((record) => record.requestId === call.id)?.part;
  // A record picked in the history list takes over from this call's own repaired part.
  const [focusedId, setFocusedId] = useState<number>();
  const focused = histories.data?.find((record) => record.part.id === focusedId)?.part ?? repaired;
  const focusedMesh = focused
    ? (parts.data?.find((part) => part.id === focused.id)?.meshName ?? focused.code)
    : undefined;
  const [error, setError] = useState("");
  const [showConversation, setShowConversation] = useState(false);
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
          <Panel
            tone="accent"
            title="AI 상담 요약"
            titleAddon={
              call.consultationId && (
                <button
                  type="button"
                  aria-expanded={showConversation}
                  onClick={() => setShowConversation((value) => !value)}
                  className="cursor-pointer text-label-lg text-primary-500 hover:text-primary-600"
                >
                  {showConversation ? "대화 접기" : "대화 전체 보기"}
                </button>
              )
            }
            className="gap-4"
          >
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
            {!!call.attachments?.length && <AttachmentList attachments={call.attachments} />}
            {showConversation && <Conversation requestId={call.id} />}
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
                  <li key={record.id} className="border-b border-secondary-100">
                    <button
                      type="button"
                      aria-pressed={focused?.id === record.part.id}
                      onClick={() => setFocusedId(record.part.id)}
                      className={`flex w-full cursor-pointer flex-wrap items-center gap-x-4 gap-y-1 px-2 py-3.5 text-left text-body-md ${
                        focused?.id === record.part.id ? "bg-primary-50" : "hover:bg-primary-50"
                      }`}
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
                    </button>
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
              partCode={focusedMesh}
              className="h-80"
            >
              {focused && (
                <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1 rounded-lg border-2 border-primary-300 bg-white px-3 py-2">
                  <span className="text-label-md text-primary-500">
                    {focused.id === repaired?.id ? "수리한 부품" : "선택한 부품"}
                  </span>
                  <span className="text-label-lg text-black">
                    {focused.name} · {focused.code}
                  </span>
                </div>
              )}
            </UnityViewer>
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

type ConversationProps = {
  requestId: number;
};

// The AI consultation the user had before calling, as they saw it.
function Conversation({ requestId }: ConversationProps) {
  const { data: messages, error } = useApi(
    () => makerApi.conversation(requestId),
    `conversation:${requestId}`,
  );

  if (!messages) return <LoadState error={error} className="py-4" />;
  return (
    <ol aria-label="상담 대화" className="flex flex-col gap-2 rounded-lg bg-white p-4">
      {messages.map((message) => {
        const fromUser = message.sender === "USER";
        return (
          <li
            key={message.id}
            className={`flex max-w-4/5 flex-col gap-1 rounded-xl px-3.5 py-2.5 text-body-md ${
              fromUser
                ? "self-end bg-primary-500 text-white"
                : "self-start bg-secondary-50 text-black"
            }`}
          >
            <span className="sr-only">{fromUser ? "이용 기업: " : "AI: "}</span>
            <span className="whitespace-pre-line">{message.content}</span>
            {!!message.payload?.steps?.length && (
              <ol className="list-inside list-decimal text-body-sm">
                {message.payload.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            )}
          </li>
        );
      })}
    </ol>
  );
}
