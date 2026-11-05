import { ConsultStatusBadge, type Consultation } from "@/entities/consultation";
import type { Equipment } from "@/entities/equipment";
import { ConsultChat } from "@/features/consult-chat";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { ModelViewer } from "@/widgets/model-viewer";

type Props = {
  consultation: Consultation;
  equipment: Equipment;
};

export function ConsultDetailPage({ consultation, equipment }: Props) {
  return (
    <>
      <AppHeader side="user" active="consult" />
      <PageMain>
        <PageHeading
          back={{ href: "/consult", label: "상담 내역" }}
          title={consultation.symptom}
          titleAddon={<ConsultStatusBadge status={consultation.status} />}
          description={`${consultation.dateLabel} 상담 · 질문 ${consultation.questions}회 · 요청번호 ${consultation.id}`}
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <ModelViewer equipment={equipment} suspect={consultation.suspect} />
          <ConsultChat consultation={consultation} />
        </div>
      </PageMain>
    </>
  );
}
