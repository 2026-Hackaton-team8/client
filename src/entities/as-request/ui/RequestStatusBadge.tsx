import { Badge, type BadgeTone } from "@/shared/ui";
import type { RequestStatus } from "../model/types";

export const requestStatusLabels: Record<RequestStatus, string> = {
  received: "접수",
  progress: "진행 중",
  done: "완료",
};

const tones: Record<RequestStatus, BadgeTone> = {
  received: "strong",
  progress: "primary",
  done: "neutral",
};

type Props = {
  status: RequestStatus;
};

export function RequestStatusBadge({ status }: Props) {
  return <Badge tone={tones[status]}>{requestStatusLabels[status]}</Badge>;
}
