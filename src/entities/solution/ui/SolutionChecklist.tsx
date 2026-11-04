"use client";

import { useState, type ReactNode } from "react";
import type { Solution } from "../model/types";

type Props = {
  solution: Solution;
  footer?: ReactNode;
};

export function SolutionChecklist({ solution, footer }: Props) {
  const [checked, setChecked] = useState<boolean[]>(() => solution.steps.map(() => false));
  const doneCount = checked.filter(Boolean).length;

  const toggle = (index: number) =>
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));

  return (
    <section className="flex flex-col gap-5 rounded-lg bg-secondary-50 p-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-sm text-black">간단하게 시도할 수 있는 솔루션</h2>
        <p className="text-body-md text-secondary-600">
          {solution.title} · 제작사 승인 {solution.approvedAt}
        </p>
      </div>
      <ol className="flex flex-col gap-3">
        {solution.steps.map((step, index) => (
          <li key={step}>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-4">
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() => toggle(index)}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-primary-500"
              />
              <span
                className={`text-body-lg ${checked[index] ? "text-secondary-600 line-through" : "text-black"}`}
              >
                {index + 1}. {step}
              </span>
            </label>
          </li>
        ))}
      </ol>
      <p className="text-body-md text-secondary-700" aria-live="polite">
        {doneCount} / {solution.steps.length}단계 확인했어요
      </p>
      {footer}
    </section>
  );
}
