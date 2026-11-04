import { Suspense } from "react";
import { recentConsultations, symptomOptions } from "@/entities/consultation";
import { equipments } from "@/entities/equipment";
import { ConsultForm } from "@/features/request-consult";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { RecentConsultations } from "@/widgets/equipment-board";

const steps = [
  ["접수", "제작 업체의 A/S 요청 기록에 바로 올라가요."],
  ["진행 중", "엔지니어가 같은 파트의 A/S 기록을 보고 방문 일정을 잡아요."],
  ["완료", "엔지니어의 A/S 보고가 설비 수리 내역에 남아요."],
];

export function ConsultPage() {
  return (
    <>
      <AppHeader side="user" active="consult" />
      <PageMain>
        <PageHeading title="수리 상담" description="증상을 알려주시면 제작 업체에 바로 전달돼요" />
        <div className="grid items-start gap-10 xl:grid-cols-5 xl:gap-10">
          <div className="xl:col-span-3">
            <Suspense fallback={<div className="h-120 rounded-lg bg-secondary-50" />}>
              <ConsultForm equipments={equipments} symptoms={symptomOptions} />
            </Suspense>
          </div>
          <div className="flex flex-col gap-10 xl:col-span-2">
            <section className="flex flex-col gap-4">
              <h2 className="text-title-lg text-black">상담 후 진행</h2>
              <ol className="flex flex-col gap-5">
                {steps.map(([title, body], index) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-label-lg text-black">
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-title-md text-black">{title}</p>
                      <p className="text-body-md text-secondary-700">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
            <RecentConsultations items={recentConsultations} />
          </div>
        </div>
      </PageMain>
    </>
  );
}
