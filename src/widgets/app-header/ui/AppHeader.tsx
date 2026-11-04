import Link from "next/link";
import { makerTabs, userTabs } from "../config/tabs";

type Props = {
  side: "user" | "maker";
  active: string;
};

const switchLinks = {
  user: { href: "/maker/requests", label: "제작 업체 화면으로" },
  maker: { href: "/", label: "사용 업체 화면으로" },
};

export function AppHeader({ side, active }: Props) {
  const tabs = side === "user" ? userTabs : makerTabs;
  const switchLink = switchLinks[side];

  return (
    <header className="bg-secondary-50">
      <div className="mx-auto flex h-14 max-w-7xl items-stretch gap-10 overflow-x-auto px-6 pt-4 md:px-10">
        <Link
          href={tabs[0].href}
          aria-label="짚어 홈"
          className="h-6 w-24 shrink-0 bg-primary-100"
        />
        <nav aria-label="주 메뉴" className="flex gap-8">
          {tabs.map((tab) => {
            const isActive = tab.key === active;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-between px-1.5 text-title-md whitespace-nowrap ${
                  isActive ? "text-black" : "text-secondary-500 hover:text-secondary-800"
                }`}
              >
                {tab.label}
                <span aria-hidden className={`h-0.75 w-full ${isActive ? "bg-primary-300" : ""}`} />
              </Link>
            );
          })}
        </nav>
        <Link
          href={switchLink.href}
          className="ml-auto shrink-0 self-start text-body-md whitespace-nowrap text-secondary-700 hover:text-black"
        >
          {switchLink.label}
        </Link>
      </div>
    </header>
  );
}
