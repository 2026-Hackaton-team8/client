import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  titleAddon?: ReactNode;
  description?: ReactNode;
  back?: { href: string; label: string };
  action?: ReactNode;
};

export function PageHeading({ title, titleAddon, description, back, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1.5">
        {back && (
          <Link href={back.href} className="text-label-lg text-primary-500 hover:text-primary-600">
            ← {back.label}
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-heading-lg text-black">{title}</h1>
          {titleAddon}
        </div>
        {description && <div className="text-body-lg text-secondary-600">{description}</div>}
      </div>
      {action}
    </div>
  );
}
