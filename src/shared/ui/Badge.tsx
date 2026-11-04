import type { ReactNode } from "react";

export type BadgeTone = "strong" | "primary" | "neutral";

type Props = {
  tone?: BadgeTone;
  children: ReactNode;
};

const tones: Record<BadgeTone, string> = {
  strong: "bg-primary-500 text-white",
  primary: "bg-primary-100 text-primary-600",
  neutral: "bg-secondary-100 text-secondary-800",
};

export function Badge({ tone = "neutral", children }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-1 text-label-md ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
