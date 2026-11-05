import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function PageMain({ children }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 pt-12 pb-20 md:px-10">
      {children}
    </main>
  );
}
