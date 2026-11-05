import type { ReactNode } from "react";

export type BadgeTone = "strong" | "accent" | "primary" | "neutral";

type Props = {
  tone?: BadgeTone;
  strike?: boolean;
  children: ReactNode;
};

const tones: Record<BadgeTone, string> = {
  strong: "border-primary-300 bg-primary-500 text-white",
  accent: "border-accent-50 bg-accent-50 text-accent-700",
  primary: "border-primary-100 bg-primary-50 text-primary-600",
  neutral: "border-secondary-100 bg-secondary-100 text-secondary-700",
};

export function Badge({ tone = "neutral", strike, children }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-1 text-label-md font-medium whitespace-nowrap ${tones[tone]} ${strike ? "line-through" : ""}`}
    >
      {children}
    </span>
  );
}
