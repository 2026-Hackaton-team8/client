import Link from "next/link";
import { findEquipment } from "@/entities/equipment";
import { recordsForModel } from "@/entities/repair-record";
import { UrgencyBadge, type ServiceCall, type Visit } from "@/entities/service-call";
import { AssignEngineerForm } from "@/features/assign-engineer";
import { formatMonthDay } from "@/shared/lib";
import { Badge, Button, ButtonLink, PageHeading, PageMain, Panel, UnityViewer } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  call: ServiceCall;
};

export function MakerCallDetailPage({ call }: Props) {
  const history = recordsForModel(call.model).slice(0, 3);
  const summary = [
    ["증상", call.summary.symptom],
    ["확인된 사항", call.summary.checked],
    ["좁힌 원인", call.summary.cause],
    ["시도한 조치", call.summary.tried],
  ];

  return (
    <>
      <AppHeader side="maker" active="calls" />
      <PageMain>
        <PageHeading
          back={{ href: "/maker/calls", label: "호출 수신함" }}
          title={`${call.company} · ${call.equipmentName}`}
          description={
            <span className="flex flex-wrap items-center gap-2 text-body-md">
              모델 {call.model} · 호출 {call.time}
              <UrgencyBadge urgency={call.urgency} />
              <Badge tone="primary">{call.reasonTag}</Badge>
            </span>
          }
          action={
            <div className="flex gap-2">
              <Button variant="ghost">신고서 PDF</Button>
              {call.status === "visited" && (
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
                call.consultId && (
                  <Link
                    href={`/consult/${call.consultId}`}
                    className="text-label-lg text-primary-500 hover:text-primary-600"
                  >
                    대화 전체 보기
                  </Link>
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
                        index === summary.length - 1
                          ? "font-semibold text-primary-500"
                          : "text-black"
                      }
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="rounded-lg border-2 border-primary-300 bg-white px-4 py-3 text-body-sm text-primary-600">
                {call.nextCheck}
              </p>
            </Panel>

            <Panel tone="plain" title={`${call.model} 모델 수리 이력`} className="gap-1">
              <ul>
                {history.map((record) => (
                  <li
                    key={record.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-secondary-100 py-3.5 text-body-md"
                  >
                    <span className="w-20 text-secondary-600">{formatMonthDay(record.date)}</span>
                    <span className="w-35 font-semibold text-black">
                      {record.partName} {record.partCode}
                    </span>
                    <span className="min-w-0 flex-1 text-black">{record.note}</span>
                    {record.equipmentId === call.equipmentId ? (
                      <Badge tone="primary">이 설비</Badge>
                    ) : (
                      <Badge tone="neutral">다른 이용 기업</Badge>
                    )}
                  </li>
                ))}
              </ul>
              <p className="pt-3 text-label-md font-normal text-secondary-600">
                다른 이용 기업의 같은 모델 이력도 함께 보여요.
              </p>
            </Panel>
          </div>

          <aside className="flex shrink-0 flex-col gap-6 lg:w-95">
            <Panel title="의심 부품 위치" className="gap-3">
              <UnityViewer
                label={`${call.model} 3D 모델`}
                equipmentCode={findEquipment(call.equipmentId)?.unityCode}
                partCode={call.unityPart}
                className="h-80"
              />
              <ul className="flex flex-col gap-2">
                {call.suspectParts.map((part) => (
                  <li
                    key={part.code}
                    className="flex items-center gap-2 text-body-sm text-secondary-700"
                  >
                    <span
                      aria-hidden
                      className={`size-2.5 rounded-xs ${part.state === "tried" ? "bg-primary-500" : "bg-primary-300"}`}
                    />
                    {part.name} {part.code} · {part.note}
                  </li>
                ))}
              </ul>
            </Panel>
            {call.status === "new" && <AssignEngineerForm />}
            {call.visit && (call.status === "assigned" || call.status === "visited") && (
              <VisitPanel callId={call.id} visit={call.visit} visited={call.status === "visited"} />
            )}
          </aside>
        </div>
      </PageMain>
    </>
  );
}

type VisitPanelProps = {
  callId: string;
  visit: Visit;
  visited: boolean;
};

// The repair record only opens once the visit date has passed.
function VisitPanel({ callId, visit, visited }: VisitPanelProps) {
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
          <dd className="text-black">{visit.engineer}</dd>
        </div>
        <div className="flex">
          <dt className="w-20 shrink-0 text-secondary-600">방문 일정</dt>
          <dd className="text-black">{visit.date}</dd>
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
