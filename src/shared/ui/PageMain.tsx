import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function PageMain({ children }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-439 flex-1 flex-col gap-16 px-8 pt-28 pb-24">
      {children}
    </main>
  );
}
