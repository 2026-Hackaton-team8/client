import type { ReactNode } from "react";
import type { EquipmentResponse } from "@/shared/api";

type Props = {
  equipment: EquipmentResponse;
  actions?: ReactNode;
};

export function EquipmentCard({ equipment, actions }: Props) {
  const specs = [
    ["모델", `${equipment.model.code} · ${equipment.model.name}`],
    ["위치", equipment.location],
    ["시리얼", equipment.serialNumber || "—"],
  ];

  return (
    <article className="flex h-full flex-col gap-6 rounded border border-secondary-100 bg-white p-5">
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="text-title-lg text-black">{equipment.name}</h3>
        <dl className="flex flex-col gap-1.5 text-label-md font-normal">
          {specs.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt className="w-16 shrink-0 text-secondary-600">{label}</dt>
              <dd className="text-right text-black">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {actions}
    </article>
  );
}
