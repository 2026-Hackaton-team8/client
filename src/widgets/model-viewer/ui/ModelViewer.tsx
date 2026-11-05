import type { Consultation } from "@/entities/consultation";
import { Panel, UnityViewer } from "@/shared/ui";

type Props = {
  name: string;
  details: string;
  equipmentCode?: string;
  suspect: Consultation["suspect"];
};

export function ModelViewer({ name, details, equipmentCode, suspect }: Props) {
  return (
    <Panel tone="plain" className="flex-1 gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-title-lg text-black">{name}</h2>
        <p className="text-body-sm text-secondary-600">{details}</p>
      </div>
      <UnityViewer
        label={`${name} 3D 모델`}
        equipmentCode={equipmentCode}
        partCode={suspect.unityPart}
        className="h-140"
      >
        <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1 rounded-lg border-2 border-primary-300 bg-white px-4 py-3">
          <span className="text-label-md text-primary-500">의심 부품</span>
          <span className="text-title-md text-black">
            {suspect.name} · {suspect.code}
          </span>
          <span className="text-body-sm text-secondary-600">{suspect.location}</span>
        </div>
      </UnityViewer>
    </Panel>
  );
}
