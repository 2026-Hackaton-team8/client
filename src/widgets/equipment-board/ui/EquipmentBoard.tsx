"use client";

import { consultations } from "@/entities/consultation";
import { EquipmentCard } from "@/entities/equipment";
import { equipmentApi, useApi } from "@/shared/api";
import { ButtonLink, LoadState, PageHeading } from "@/shared/ui";
import { RecentRequests } from "./RecentRequests";

// AI consultation has no API yet, so 고장 상담 opens a sample consultation and carries the
// real equipment id along for the report it may end in.
function consultHref(equipmentId: number) {
  return `/consult/${consultations[0].id}?equipment=${equipmentId}`;
}

export function EquipmentBoard() {
  const { data: equipments, error, loading } = useApi(equipmentApi.list, "equipments");

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
      <section className="flex min-w-0 flex-1 flex-col gap-6">
        <PageHeading
          title="내 설비"
          description="고장이 나면 설비를 골라 상담을 시작하세요."
          action={<ButtonLink href="/equipment/new">+ 설비 등록</ButtonLink>}
        />
        {loading || error ? (
          <LoadState error={error} />
        ) : equipments?.length === 0 ? (
          <p className="py-10 text-center text-body-md text-secondary-600">
            아직 등록한 설비가 없어요. 사용 중인 설비를 등록해 주세요.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {equipments?.map((equipment) => (
              <li key={equipment.id}>
                <EquipmentCard
                  equipment={equipment}
                  actions={
                    <div className="flex gap-2">
                      <ButtonLink
                        href={consultHref(equipment.id)}
                        size="sm"
                        block
                        className="flex-1"
                      >
                        고장 상담
                      </ButtonLink>
                      <ButtonLink
                        href={`/equipment/${equipment.id}/history`}
                        size="sm"
                        variant="ghost"
                        block
                        className="flex-1"
                      >
                        수리 이력
                      </ButtonLink>
                    </div>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      <RecentRequests />
    </div>
  );
}
