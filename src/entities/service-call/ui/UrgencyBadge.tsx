import type { Urgency } from "@/shared/api";
import { Badge, type BadgeTone } from "@/shared/ui";

type Props = {
  urgency: Urgency;
};

const labels: Record<Urgency, string> = { HIGH: "긴급", MEDIUM: "보통", LOW: "낮음" };
const tones: Record<Urgency, BadgeTone> = { HIGH: "accent", MEDIUM: "primary", LOW: "neutral" };

export function UrgencyBadge({ urgency }: Props) {
  return <Badge tone={tones[urgency]}>{labels[urgency]}</Badge>;
}
