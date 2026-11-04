import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeading({ title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="flex flex-col gap-3.5">
        <h1 className="text-display-xl text-black">{title}</h1>
        {description && <p className="text-heading-md text-secondary-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
