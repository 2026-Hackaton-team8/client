"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const reply = "도어 잠금부 센서 오류일 가능성이 높아요. 전원을 끄고 도어 래치를 확인해 보세요.";

const TYPE_START_MS = 900;
const TYPE_STEP_MS = 35;

// Mock of the consult screen: a pinned part on the equipment photo and an AI reply that types out.
// Clicking the pin replays the reply; the card tilts slightly toward the cursor.
export function ConsultPreview() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const step = (count: number) => {
      setTyped(count);
      if (count < reply.length) timer = setTimeout(() => step(count + 1), TYPE_STEP_MS);
    };
    timer = setTimeout(() => step(1), run === 0 ? TYPE_START_MS : 300);
    return () => {
      clearTimeout(timer);
      setTyped(0);
    };
  }, [run]);

  const done = typed >= reply.length;

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1200px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  };

  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="flex w-full max-w-130 shrink-0 flex-col gap-4 rounded-xl border border-primary-100 bg-white p-6 shadow-[0_12px_32px_rgba(90,119,179,0.12)] transition-transform duration-300 ease-out will-change-transform"
    >
      <div className="flex items-center gap-2">
        <span className="text-title-md text-black">ROBOT-001</span>
        <span className="text-body-md text-secondary-600">WM-20</span>
      </div>
      <div className="relative h-65 overflow-hidden rounded-lg bg-secondary-100">
        <div className="absolute -top-2 left-1/2 -ml-2 h-90 w-102 -translate-x-1/2 animate-float">
          <Image
            src="/landing/hero-robot.png"
            alt="산업용 로봇 팔"
            fill
            priority
            sizes="408px"
            className="object-contain"
          />
          <button
            type="button"
            onClick={() => setRun((value) => value + 1)}
            aria-label="도어 잠금부 짚기"
            className="group absolute top-27 left-61.25 size-10 cursor-pointer"
          >
            <Image
              src="/landing/pin-ring.svg"
              alt=""
              width={40}
              height={40}
              className="absolute inset-0 size-10 animate-pin-pulse"
            />
            <Image
              src="/landing/pin-ring.svg"
              alt=""
              width={40}
              height={40}
              className="absolute inset-0 size-10 transition-transform group-hover:scale-125"
            />
            <Image
              src="/landing/pin.svg"
              alt=""
              width={16}
              height={16}
              className="absolute top-3 left-3 size-4"
            />
          </button>
          <span
            key={run}
            className="pointer-events-none absolute top-19.75 left-70 animate-pop-in rounded-md bg-primary-500 px-2.5 py-1.5 text-label-md whitespace-nowrap text-white [animation-delay:400ms]"
          >
            도어 잠금부
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 rounded-lg bg-primary-50 px-4 py-3">
        <span className="text-label-md text-primary-500">AI 상담</span>
        <p className="relative text-body-md text-black">
          {/* Reserve the full reply's height so the card doesn't grow while typing. */}
          <span className="invisible">{reply}</span>
          <span className="absolute inset-0" aria-live="polite">
            {reply.slice(0, typed)}
            {!done && (
              <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-caret bg-primary-500" />
            )}
          </span>
        </p>
      </div>
      <div
        data-done={done}
        className="flex justify-end gap-2 opacity-40 transition-opacity duration-500 data-[done=true]:opacity-100"
      >
        <span className="inline-flex h-8 items-center rounded-lg bg-secondary-100 px-3 text-body-sm font-semibold text-secondary-700">
          해결됐어요
        </span>
        <span className="inline-flex h-8 items-center rounded-lg bg-primary-300 px-3 text-body-sm font-semibold text-primary-50">
          담당자 호출
        </span>
      </div>
    </div>
  );
}
