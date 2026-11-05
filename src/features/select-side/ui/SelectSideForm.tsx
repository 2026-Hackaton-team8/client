"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui";

type Side = "user" | "maker";

const options: { value: Side; title: string; caption: string; features: string[] }[] = [
  {
    value: "user",
    title: "사용 업체",
    caption: "설비를 사용하는 공장 · 현장",
    features: ["내 설비 등록과 현황 확인", "3D 모델로 고장 부위 상담", "담당자 호출 신고서 작성"],
  },
  {
    value: "maker",
    title: "제작 업체",
    caption: "설비를 만들고 A/S를 제공하는 업체",
    features: ["들어온 호출 확인과 담당자 배정", "수리 이력 기록", "모델별 매뉴얼 · 솔루션 관리"],
  },
];

// No account API yet, so the choice only decides which home to open.
const homeBySide: Record<Side, string> = {
  user: "/",
  maker: "/maker/calls",
};

export function SelectSideForm() {
  const router = useRouter();
  const [side, setSide] = useState<Side | null>(null);
  const selected = options.find((option) => option.value === side);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (side) router.push(homeBySide[side]);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-10">
      <fieldset className="grid w-full max-w-186 gap-6 sm:grid-cols-2">
        <legend className="sr-only">업체 유형</legend>
        {options.map((option) => {
          const checked = option.value === side;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col gap-5 rounded-xl border-2 p-7 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-500 ${
                checked
                  ? "border-primary-300 bg-primary-50 shadow-[0_8px_24px_rgba(90,119,179,0.12)]"
                  : "border-secondary-100 bg-white hover:border-secondary-300"
              }`}
            >
              <input
                type="radio"
                name="side"
                value={option.value}
                checked={checked}
                onChange={() => setSide(option.value)}
                className="sr-only"
              />
              <span className="flex items-start justify-between">
                <SideIcon side={option.value} active={checked} />
                <span
                  aria-hidden
                  className={`flex size-5.5 items-center justify-center rounded-full border-2 ${
                    checked ? "border-primary-500 bg-primary-500" : "border-secondary-300 bg-white"
                  }`}
                >
                  {checked && <span className="size-2 rounded-full bg-white" />}
                </span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-heading-sm text-black">{option.title}</span>
                <span className="text-body-md text-secondary-600">{option.caption}</span>
              </span>
              <span
                aria-hidden
                className={`h-px ${checked ? "bg-primary-100" : "bg-secondary-100"}`}
              />
              <ul className="flex flex-col gap-2.5">
                {option.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-body-md text-secondary-700"
                  >
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full ${checked ? "bg-primary-500" : "bg-secondary-300"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </label>
          );
        })}
      </fieldset>
      <div className="flex w-80 flex-col items-center gap-3">
        <Button type="submit" variant="strong" block disabled={!selected}>
          {selected ? `${selected.title}로 시작하기` : "업체 유형을 선택해 주세요"}
        </Button>
        <p className="text-body-sm text-secondary-600">
          선택한 유형은 나중에 설정에서 바꿀 수 있어요.
        </p>
      </div>
    </form>
  );
}

type SideIconProps = {
  side: Side;
  active: boolean;
};

// Simple glyphs from the design: a factory for users, a gear-and-handle tool for makers.
function SideIcon({ side, active }: SideIconProps) {
  const fill = active ? "bg-primary-500" : "bg-secondary-600";
  return (
    <span
      aria-hidden
      className={`relative size-14 rounded-xl ${active ? "bg-primary-100" : "bg-secondary-50"}`}
    >
      {side === "user" ? (
        <>
          <span className={`absolute top-6 left-3.25 h-4.5 w-7.5 rounded-xs ${fill}`} />
          <span className={`absolute top-3 left-8.75 h-3.5 w-1.5 ${fill}`} />
        </>
      ) : (
        <>
          <span
            className={`absolute top-3 left-4 size-6 rounded-full border-5 ${active ? "border-primary-500" : "border-secondary-600"}`}
          />
          <span className={`absolute top-8.5 left-6.25 h-3.5 w-1.5 rounded-full ${fill}`} />
        </>
      )}
    </span>
  );
}
