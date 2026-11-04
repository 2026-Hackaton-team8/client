import type { ReactNode } from "react";
import type { Equipment } from "../model/types";

type Props = {
  equipment: Equipment;
  actions: ReactNode;
};

export function EquipmentCard({ equipment, actions }: Props) {
  const specs = [
    ["위치", `${equipment.model} - ${equipment.site}`],
    ["시리얼", equipment.serial],
    ["최근 A/S", equipment.lastService],
  ];

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg bg-secondary-50 p-4">
      <div aria-hidden className="h-28 w-full rounded-lg bg-secondary-100" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h3 className="text-title-md text-black">{equipment.name}</h3>
          <dl className="flex flex-col gap-1.5 text-body-sm">
            {specs.map(([term, value]) => (
              <div key={term} className="flex">
                <dt className="w-16 shrink-0 text-secondary-600">{term}</dt>
                <dd className="text-black">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex gap-3">{actions}</div>
      </div>
    </article>
  );
}
