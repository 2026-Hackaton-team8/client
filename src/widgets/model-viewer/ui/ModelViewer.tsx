import type { PartResponse } from "@/shared/api";
import { Panel, UnityViewer } from "@/shared/ui";

type Props = {
  name: string;
  details: string;
  equipmentCode?: string;
  // The part the AI suspects so far, highlighted in 3D.
  suspect?: PartResponse;
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
        // Unity highlights by mesh name ("ROBOT-001:BASE"); fall back to the part code.
        partCode={suspect?.meshName ?? suspect?.code}
        className="h-140"
      >
        {suspect && (
          <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1 rounded-lg border-2 border-primary-300 bg-white px-4 py-3">
            <span className="text-label-md text-primary-500">의심 부품</span>
            <span className="text-title-md text-black">
              {suspect.name} · {suspect.code}
            </span>
            {suspect.locationDesc && (
              <span className="text-body-sm text-secondary-600">{suspect.locationDesc}</span>
            )}
          </div>
        )}
      </UnityViewer>
    </Panel>
  );
}
