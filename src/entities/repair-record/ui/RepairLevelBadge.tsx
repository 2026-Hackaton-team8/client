import { Badge } from "@/shared/ui";
import type { RepairLevel } from "../model/types";

type Props = {
  level: RepairLevel;
};

export function RepairLevelBadge({ level }: Props) {
  return level === "user" ? (
    <Badge tone="primary">사용자 조치</Badge>
  ) : (
    <Badge tone="strong">기사 출동</Badge>
  );
}
