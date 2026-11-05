import Link from "next/link";
import { ConsultStatusBadge, consultations } from "@/entities/consultation";
import { findEquipment } from "@/entities/equipment";
import { Panel } from "@/shared/ui";

export function RecentConsultations() {
  return (
    <aside className="shrink-0 lg:w-85">
      <Panel tone="plain" title="최근 상담" className="gap-1">
        <ul className="flex flex-col">
          {consultations.slice(0, 3).map((consultation) => (
            <li key={consultation.id} className="border-b border-secondary-100 py-4">
              <Link
                href={`/consult/${consultation.id}`}
                className="group flex flex-col gap-1.5 focus-visible:outline-2 focus-visible:outline-primary-500"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-label-lg text-black group-hover:text-primary-600">
                    {findEquipment(consultation.equipmentId)?.name}
                  </span>
                  <ConsultStatusBadge status={consultation.status} />
                </span>
                <span className="text-body-sm text-secondary-700">{consultation.summary}</span>
                <span className="text-label-md font-normal text-secondary-600">
                  {consultation.dateLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/consult" className="pt-3 text-body-sm text-secondary-700 hover:text-black">
          더보기
        </Link>
      </Panel>
    </aside>
  );
}
