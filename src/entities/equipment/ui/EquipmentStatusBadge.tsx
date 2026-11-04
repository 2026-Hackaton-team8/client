import { Badge, type BadgeTone } from "@/shared/ui";
import type { EquipmentStatus } from "../model/types";

const labels: Record<EquipmentStatus, [string, BadgeTone]> = {
  fault: ["고장", "strong"],
  progress: ["수리 중", "primary"],
  normal: ["정상", "neutral"],
};

type Props = {
  status: EquipmentStatus;
};

export function EquipmentStatusBadge({ status }: Props) {
  const [label, tone] = labels[status];
  return <Badge tone={tone}>{label}</Badge>;
}
