import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeading({ title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading-lg text-black">{title}</h1>
        {description && <p className="text-title-lg text-secondary-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
