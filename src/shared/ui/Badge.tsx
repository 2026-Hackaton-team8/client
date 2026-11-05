import type { ReactNode } from "react";

export type BadgeTone = "strong" | "accent" | "primary" | "neutral";

type Props = {
  tone?: BadgeTone;
  strike?: boolean;
  children: ReactNode;
};

const tones: Record<BadgeTone, string> = {
  strong: "bg-primary-500 text-white",
  accent: "bg-primary-300 text-white",
  primary: "bg-primary-100 text-primary-600",
  neutral: "bg-secondary-100 text-secondary-700",
};

export function Badge({ tone = "neutral", strike, children }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-1 text-label-md whitespace-nowrap ${tones[tone]} ${strike ? "line-through" : ""}`}
    >
      {children}
    </span>
  );
}
