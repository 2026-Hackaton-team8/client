import { Badge } from "@/shared/ui";
import type { RepairLevel } from "../model/types";

type Props = {
  level: RepairLevel;
};

export function RepairLevelBadge({ level }: Props) {
  return level === "user" ? (
    <Badge tone="primary">직접 가능</Badge>
  ) : (
    <Badge tone="neutral">엔지니어</Badge>
  );
}
