import type { ReactNode } from "react";
import { Placeholder } from "@/shared/ui";
import type { Equipment } from "../model/types";

type Props = {
  equipment: Equipment;
  actions?: ReactNode;
};

export function EquipmentCard({ equipment, actions }: Props) {
  const specs = [
    ["모델", equipment.model],
    ["위치", equipment.place],
    ["최근 A/S", equipment.lastService],
  ];

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg bg-secondary-50 p-5">
      <Placeholder label={`${equipment.name} 사진`} className="h-35" />
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="text-title-md text-black">{equipment.name}</h3>
        <dl className="flex flex-col gap-1.5 text-label-md font-normal">
          {specs.map(([label, value]) => (
            <div key={label} className="flex">
              <dt className="w-16 shrink-0 text-secondary-600">{label}</dt>
              <dd className="text-black">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {actions}
    </article>
  );
}
