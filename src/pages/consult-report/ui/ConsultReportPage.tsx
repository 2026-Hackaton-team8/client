import { ReportForm } from "@/features/request-engineer";
import { PageHeading, PageMain, Panel } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  consultationId: number;
};

// Only what the report actually sends to the maker.
const attachments = [
  "AI 상담 대화와 요약",
  "증상 · 설비 상태",
  "첨부한 사진 · 영상",
  "담당자 · 회사 연락처",
];

const steps = [
  ["접수", "제작 업체 호출 수신함에 바로 올라가요."],
  ["엔지니어 배정", "같은 모델 수리 이력을 보고 방문 일정을 잡아요."],
  ["방문 수리", "배정되면 알림으로 일정을 알려 드려요."],
  ["수리 완료", "수리 내용이 설비 이력에 남아요."],
];

export function ConsultReportPage({ consultationId }: Props) {
  return (
    <>
      <AppHeader side="user" active="equipment" />
      <PageMain>
        <PageHeading
          back={{ href: `/consult/${consultationId}`, label: "AI 상담" }}
          title="담당자 호출 신고서"
          description="AI 상담 내용은 자동으로 채워져요. 확인하고 필요한 내용을 직접 적어 주세요."
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <ReportForm consultationId={consultationId} />
          <aside className="flex shrink-0 flex-col gap-6 lg:w-90">
            <Panel title="제출 후 진행" className="gap-4">
              <ol className="flex flex-col gap-3.5">
                {steps.map(([title, description], index) => (
                  <li key={title} className="flex gap-3">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-label-md ${
                        index === 0
                          ? "bg-primary-500 text-white"
                          : "bg-primary-100 text-primary-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-label-lg text-black">{title}</span>
                      <span className="text-body-sm text-secondary-600">{description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Panel>
            <Panel title="함께 전달돼요" className="gap-3">
              <ul className="flex flex-col gap-2">
                {attachments.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-body-md text-secondary-700"
                  >
                    <span aria-hidden className="size-1.5 rounded-full bg-primary-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </aside>
        </div>
      </PageMain>
    </>
  );
}
