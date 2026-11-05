"use client";

import { useState } from "react";
import { ConsultStatusBadge } from "@/entities/consultation";
import { ConsultChat } from "@/features/consult-chat";
import { consultationApi, modelApi, useApi, type ConsultationDetailResponse } from "@/shared/api";
import { unityCodeFor } from "@/shared/config";
import { formatDateTime } from "@/shared/lib";
import { LoadState, PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { ModelViewer } from "@/widgets/model-viewer";

type Props = {
  consultationId: number;
};

export function ConsultDetailPage({ consultationId }: Props) {
  const consultation = useApi(
    () => consultationApi.get(consultationId),
    `consultation:${consultationId}`,
  );
  // Each answer returns the whole consultation, so it replaces what was loaded.
  const [answered, setLatest] = useState<ConsultationDetailResponse>();
  const latest = answered ?? consultation.data;
  const modelId = latest?.equipment.modelId;
  const model = useApi(
    () => (modelId ? modelApi.get(modelId) : Promise.resolve(undefined)),
    `model:${modelId}`,
  );
  // The suspected part is pointed out in 3D only once the AI offers a solution.
  const solved = latest?.messages.some((message) => message.type === "SOLUTION");

  return (
    <>
      <AppHeader side="user" active="equipment" />
      <PageMain>
        {!latest ? (
          <LoadState error={consultation.error} />
        ) : (
          <>
            <PageHeading
              back={{ href: "/", label: "내 설비" }}
              title={latest.symptom}
              titleAddon={<ConsultStatusBadge status={latest.status} />}
              description={`${formatDateTime(latest.createdAt)} 상담 · 질문 ${latest.questionCount}회${latest.aiCause ? ` · 좁힌 원인: ${latest.aiCause}` : ""}`}
            />
            <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
              <ModelViewer
                name={latest.equipment.name}
                details={`${latest.equipment.modelCode} · ${latest.equipment.location}`}
                equipmentCode={unityCodeFor(model.data)}
                suspect={solved ? latest.suspectedPart : undefined}
              />
              <ConsultChat consultation={latest} onChange={setLatest} />
            </div>
          </>
        )}
      </PageMain>
    </>
  );
}
