import { Badge } from "@/shared/ui";
import type { HistoryItem } from "../model/types";

type Props = {
  items: HistoryItem[];
  emptyText?: string;
};

export function HistoryList({ items, emptyText = "아직 기록이 없어요." }: Props) {
  if (items.length === 0) {
    return <p className="py-5 text-body-md text-secondary-600">{emptyText}</p>;
  }

  return (
    <ol className="flex flex-col">
      {items.map((item, index) => (
        <li key={item.id} className="flex flex-col">
          {index > 0 && <div aria-hidden className="mx-6.25 h-0.5 rounded-lg bg-secondary-100" />}
          <div className="flex items-start justify-between gap-6 px-2.5 py-5">
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={item.kind === "fault" ? "strong" : "primary"}>
                  {item.kind === "fault" ? "고장" : "A/S"}
                </Badge>
                <p className="text-title-md text-black">{item.title}</p>
              </div>
              {item.note && <p className="text-body-md text-secondary-800">{item.note}</p>}
              <p className="text-body-md text-secondary-600">
                {[item.part, item.by].filter(Boolean).join(" · ")}
              </p>
            </div>
            <time className="shrink-0 text-body-md text-secondary-600">{item.date}</time>
          </div>
        </li>
      ))}
    </ol>
  );
}
