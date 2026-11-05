import type { Consultation } from "@/entities/consultation";
import type { Equipment } from "@/entities/equipment";
import { Button, Panel } from "@/shared/ui";

type Props = {
  equipment: Equipment;
  suspect: Consultation["suspect"];
};

// Static stand-in for the 3D model; the suspect part is marked on the drawing.
export function ModelViewer({ equipment, suspect }: Props) {
  return (
    <Panel tone="plain" className="flex-1 gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-auto flex flex-col gap-1">
          <h2 className="text-title-lg text-black">{equipment.name}</h2>
          <p className="text-body-sm text-secondary-600">
            {equipment.model} · {equipment.place}
          </p>
        </div>
        <Button size="sm" variant="ghost" aria-label="확대">
          +
        </Button>
        <Button size="sm" variant="ghost" aria-label="축소">
          −
        </Button>
        <Button size="sm" variant="ghost">
          시점 초기화
        </Button>
      </div>
      <div
        role="img"
        aria-label={`${equipment.name} 3D 모델, ${suspect.name}이 강조됨`}
        className="relative flex h-140 items-center justify-center rounded-lg bg-secondary-100"
      >
        <div className="relative flex h-75 w-60 justify-center rounded-xl border-2 border-secondary-300 bg-white pt-17.5">
          <div className="size-37.5 rounded-full border-2 border-secondary-300 bg-secondary-50" />
          <div className="absolute bottom-5 left-5 h-6.5 w-13 rounded bg-primary-500" />
        </div>
        <div className="absolute bottom-6 left-6 flex flex-col gap-1 rounded-lg border-2 border-primary-300 bg-white px-4 py-3">
          <span className="text-label-md text-primary-500">의심 부품</span>
          <span className="text-title-md text-black">
            {suspect.name} · {suspect.code}
          </span>
          <span className="text-body-sm text-secondary-600">{suspect.location}</span>
        </div>
        <span className="absolute top-4 right-4 rounded-md bg-white px-2 py-1 text-label-md font-normal text-secondary-600">
          드래그로 회전
        </span>
      </div>
    </Panel>
  );
}
