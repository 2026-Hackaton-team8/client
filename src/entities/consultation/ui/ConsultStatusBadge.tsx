import type { ConsultationStatus } from "@/shared/api";
import { Badge, type BadgeTone } from "@/shared/ui";

type Props = {
  status: ConsultationStatus;
};

export const consultStatusLabels: Record<ConsultationStatus, string> = {
  IN_PROGRESS: "진행 중",
  ESCALATED: "담당자 호출",
  RESOLVED: "해결됨",
};

const tones: Record<ConsultationStatus, BadgeTone> = {
  IN_PROGRESS: "primary",
  ESCALATED: "strong",
  RESOLVED: "neutral",
};

export function ConsultStatusBadge({ status }: Props) {
  return <Badge tone={tones[status]}>{consultStatusLabels[status]}</Badge>;
}
