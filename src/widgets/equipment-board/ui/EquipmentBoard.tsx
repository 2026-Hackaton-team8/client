import { consultations } from "@/entities/consultation";
import { EquipmentCard, equipments } from "@/entities/equipment";
import { ButtonLink, PageHeading } from "@/shared/ui";
import { RecentConsultations } from "./RecentConsultations";

// Until a "start consultation" screen exists, 고장 상담 opens the equipment's latest consultation.
function consultHref(equipmentId: string) {
  const latest = consultations.find((consultation) => consultation.equipmentId === equipmentId);
  return `/consult/${latest?.id ?? consultations[0].id}`;
}

export function EquipmentBoard() {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
      <section className="flex min-w-0 flex-1 flex-col gap-6">
        <PageHeading
          title="내 설비"
          description="고장이 나면 설비를 골라 상담을 시작하세요."
          action={<ButtonLink href="/equipment/new">+ 설비 등록</ButtonLink>}
        />
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {equipments.map((equipment) => (
            <li key={equipment.id}>
              <EquipmentCard
                equipment={equipment}
                actions={
                  <div className="flex gap-2">
                    <ButtonLink href={consultHref(equipment.id)} size="sm" block className="flex-1">
                      고장 상담
                    </ButtonLink>
                    <ButtonLink href="/consult" size="sm" variant="ghost" block className="flex-1">
                      수리 이력
                    </ButtonLink>
                  </div>
                }
              />
            </li>
          ))}
        </ul>
      </section>
      <RecentConsultations />
    </div>
  );
}
