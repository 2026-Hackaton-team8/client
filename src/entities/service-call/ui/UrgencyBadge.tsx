import { Badge, type BadgeTone } from "@/shared/ui";
import type { CallUrgency } from "../model/types";

type Props = {
  urgency: CallUrgency;
};

const labels: Record<CallUrgency, string> = { high: "긴급", mid: "보통", low: "낮음" };
const tones: Record<CallUrgency, BadgeTone> = { high: "accent", mid: "primary", low: "neutral" };

export function UrgencyBadge({ urgency }: Props) {
  return <Badge tone={tones[urgency]}>{labels[urgency]}</Badge>;
}
