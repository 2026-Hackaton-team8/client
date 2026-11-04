"use client";

import { useState } from "react";
import type { Consultation } from "@/entities/consultation";
import { EquipmentCard, type Equipment } from "@/entities/equipment";
import { Button, ButtonLink, PageHeading, TextField } from "@/shared/ui";
import { RecentConsultations } from "./RecentConsultations";

type Props = {
  equipments: Equipment[];
  consultations: Consultation[];
};

export function EquipmentBoard({ equipments, consultations }: Props) {
  const [query, setQuery] = useState("");
  const keyword = query.trim();
  const visible = keyword
    ? equipments.filter((equipment) => equipment.name.includes(keyword))
    : equipments;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-3">
      <section className="flex min-w-0 flex-col gap-8 lg:col-span-2">
        <PageHeading
          title="내 설비"
          description="고장이 나면 설비를 골라 상담하세요"
          action={
            <Button variant="soft" size="lg">
              장비 등록
            </Button>
          }
        />
        {visible.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((equipment) => (
              <li key={equipment.id}>
                <EquipmentCard
                  equipment={equipment}
                  actions={
                    <>
                      <ButtonLink
                        href={`/consult?equipment=${equipment.id}`}
                        className="flex-1"
                        aria-label={`${equipment.name} 수리 상담`}
                      >
                        수리 상담
                      </ButtonLink>
                      <ButtonLink
                        href={`/equipment/${equipment.id}`}
                        variant="secondary"
                        className="flex-1"
                        aria-label={`${equipment.name} 수리 내역`}
                      >
                        수리 내역
                      </ButtonLink>
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-title-md text-secondary-600">
            &lsquo;{keyword}&rsquo;에 맞는 설비가 없어요.
          </p>
        )}
      </section>

      <aside className="flex min-w-0 flex-col gap-8">
        <div>
          <TextField
            type="search"
            label="장비명으로 검색하기"
            hideLabel
            placeholder="장비명으로 검색하기"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <RecentConsultations items={consultations} />
      </aside>
    </div>
  );
}
