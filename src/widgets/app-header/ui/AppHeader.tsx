import Link from "next/link";
import { Badge, Logo } from "@/shared/ui";
import { headerUsers, makerTabs, userTabs } from "../config/tabs";

type Props = {
  side: "user" | "maker";
  active: string;
};

const tabStyles = "flex flex-col justify-end gap-3.5 text-title-md whitespace-nowrap";

// Test-only: there's no login yet, so this jumps between the two sides.
const switchLinks = {
  user: { href: "/maker/calls", label: "제작 업체로 전환" },
  maker: { href: "/", label: "사용 업체로 전환" },
};

export function AppHeader({ side, active }: Props) {
  const tabs = side === "user" ? userTabs : makerTabs;

  return (
    <header className="bg-secondary-50">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-10 overflow-x-auto px-6 md:px-10">
        <Logo href={tabs[0].href ?? "/"} />
        <nav aria-label="주 메뉴" className="flex h-full gap-8">
          {tabs.map((tab) => {
            const isActive = tab.key === active;
            const indicator = (
              <span aria-hidden className={`h-0.75 w-full ${isActive ? "bg-primary-300" : ""}`} />
            );
            if (!tab.href) {
              return (
                <span key={tab.key} aria-disabled className={`${tabStyles} text-secondary-300`}>
                  {tab.label}
                  {indicator}
                </span>
              );
            }
            return (
              <Link
                key={tab.key}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`${tabStyles} ${
                  isActive ? "text-black" : "font-normal text-secondary-600 hover:text-black"
                }`}
              >
                {tab.label}
                {indicator}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          {side === "maker" && <Badge tone="accent">제작 업체</Badge>}
          <span className="text-body-md whitespace-nowrap text-secondary-700">
            {headerUsers[side]}
          </span>
          <Link
            href={switchLinks[side].href}
            className="rounded-md border border-secondary-300 px-2 py-1 text-label-md whitespace-nowrap text-secondary-700 hover:border-secondary-500 hover:text-black"
          >
            {switchLinks[side].label}
          </Link>
        </div>
      </div>
    </header>
  );
}
