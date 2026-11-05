import type { ReactNode } from "react";

export type PanelTone = "muted" | "accent" | "outline" | "plain";

type Props = {
  tone?: PanelTone;
  title?: string;
  titleAddon?: ReactNode;
  className?: string;
  children: ReactNode;
};

const tones: Record<PanelTone, string> = {
  muted: "rounded-lg bg-secondary-50 p-6",
  accent: "rounded-lg bg-primary-50 p-6",
  outline: "rounded-lg border border-secondary-100 bg-white p-6",
  plain: "p-6",
};

export function Panel({ tone = "muted", title, titleAddon, className, children }: Props) {
  return (
    <section className={`flex min-w-0 flex-col gap-5 ${tones[tone]} ${className ?? ""}`}>
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-title-lg text-black">{title}</h2>
          {titleAddon}
        </div>
      )}
      {children}
    </section>
  );
}
