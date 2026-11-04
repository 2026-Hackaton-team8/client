import Link from "next/link";
import type { Consultation } from "@/entities/consultation";
import { ButtonLink } from "@/shared/ui";

type Props = {
  items: Consultation[];
};

export function RecentConsultations({ items }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-lg text-black">최근 수리 상담</h2>
      <ul className="flex flex-col gap-2 bg-white">
        {items.map((item, index) => (
          <li key={item.id} className="flex flex-col gap-2">
            {index > 0 && <div aria-hidden className="mx-6.25 h-0.5 rounded-lg bg-secondary-100" />}
            <div className="flex items-center justify-between px-2.5 py-5">
              <div className="flex flex-col gap-3.75">
                <p className="text-title-md text-black">{item.equipmentName}</p>
                <p className="text-body-md text-secondary-600">{item.date}</p>
              </div>
              <ButtonLink
                href={`/equipment/${item.equipmentId}`}
                variant="ghost"
                size="sm"
                aria-label={`${item.equipmentName} ${item.date} 내역 조회`}
              >
                내역 조회
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Link href="/consult" className="text-body-md text-secondary-700 hover:text-black">
          더보기
        </Link>
      </div>
    </section>
  );
}
