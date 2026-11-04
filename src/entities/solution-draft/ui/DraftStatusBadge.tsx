import { Badge } from "@/shared/ui";

type Props = {
  approved: boolean;
};

export function DraftStatusBadge({ approved }: Props) {
  return <Badge tone={approved ? "primary" : "neutral"}>{approved ? "승인" : "초안"}</Badge>;
}
