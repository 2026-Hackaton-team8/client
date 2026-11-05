import { Badge, type BadgeTone } from "@/shared/ui";
import type { ConsultStatus } from "../model/types";

type Props = {
  status: ConsultStatus;
};

export const consultStatusLabels: Record<ConsultStatus, string> = {
  calling: "담당자 호출",
  progress: "진행 중",
  resolved: "해결됨",
};

const tones: Record<ConsultStatus, BadgeTone> = {
  calling: "strong",
  progress: "primary",
  resolved: "neutral",
};

export function ConsultStatusBadge({ status }: Props) {
  return <Badge tone={tones[status]}>{consultStatusLabels[status]}</Badge>;
}
