"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ConsultStatusBadge,
  consultations,
  consultStatusLabels,
  type ConsultStatus,
} from "@/entities/consultation";
import { findEquipment } from "@/entities/equipment";
import { Chip, PageHeading } from "@/shared/ui";

type Filter = "all" | ConsultStatus;

const filters: Filter[] = ["all", "progress", "calling", "resolved"];

function count(filter: Filter) {
  return filter === "all"
    ? consultations.length
    : consultations.filter((consultation) => consultation.status === filter).length;
}

export function ConsultHistory() {
  const [filter, setFilter] = useState<Filter>("all");
  const rows =
    filter === "all"
      ? consultations
      : consultations.filter((consultation) => consultation.status === filter);

  return (
    <>
      <PageHeading
        title="상담 내역"
        description="지금까지 진행한 고장 상담이에요. 항목을 누르면 상담 내용을 다시 볼 수 있어요."
        action={
          <div role="group" aria-label="상태 필터" className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <Chip key={item} selected={filter === item} onClick={() => setFilter(item)}>
                {item === "all" ? "전체" : consultStatusLabels[item]} {count(item)}
              </Chip>
            ))}
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-collapse text-left">
          <thead>
            <tr className="border-b border-secondary-100 text-label-md text-secondary-600">
              <th scope="col" className="w-60 px-6 py-3.5 font-semibold">
                설비
              </th>
              <th scope="col" className="px-6 py-3.5 font-semibold">
                증상
              </th>
              <th scope="col" className="w-55 px-6 py-3.5 font-semibold">
                AI가 좁힌 원인
              </th>
              <th scope="col" className="w-30 px-6 py-3.5 font-semibold">
                상태
              </th>
              <th scope="col" className="w-28 px-6 py-3.5 font-semibold">
                상담일
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((consultation) => {
              const equipment = findEquipment(consultation.equipmentId);
              return (
                <tr
                  key={consultation.id}
                  className="relative border-b border-secondary-100 last:border-b-0 hover:bg-secondary-50"
                >
                  <td className="px-6 py-4.5">
                    <p className="text-title-md text-black">{equipment?.name}</p>
                    <p className="text-body-sm text-secondary-600">
                      {equipment?.model} · {equipment?.place}
                    </p>
                  </td>
                  <td className="px-6 py-4.5 text-body-md text-black">
                    <Link
                      href={`/consult/${consultation.id}`}
                      className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                      {consultation.symptom}
                    </Link>
                  </td>
                  <td className="px-6 py-4.5 text-body-md text-secondary-700">
                    {consultation.cause}
                  </td>
                  <td className="px-6 py-4.5">
                    <ConsultStatusBadge status={consultation.status} />
                  </td>
                  <td className="px-6 py-4.5 text-body-sm text-secondary-600">
                    {consultation.dateLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
