"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, TextField } from "@/shared/ui";

type Side = "user" | "maker";

const sides: { value: Side; label: string }[] = [
  { value: "user", label: "사용 업체" },
  { value: "maker", label: "제작 업체" },
];

// No auth API yet, so submitting just lands on the chosen side's home.
const homeBySide: Record<Side, string> = {
  user: "/",
  maker: "/maker/calls",
};

export function LoginForm() {
  const router = useRouter();
  const [side, setSide] = useState<Side>("user");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(homeBySide[side]);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-100 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading-lg text-black">로그인</h1>
        <p className="text-body-lg text-secondary-600">짚어 계정으로 로그인해 주세요.</p>
      </div>
      <fieldset className="flex gap-1 rounded-[10px] bg-secondary-50 p-1">
        <legend className="sr-only">업체 유형</legend>
        {sides.map((option) => {
          const checked = option.value === side;
          return (
            <label
              key={option.value}
              className={`flex h-9 flex-1 cursor-pointer items-center justify-center rounded-lg text-label-lg transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-500 ${
                checked ? "bg-white text-black shadow-sm" : "text-secondary-600 hover:text-black"
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
              {option.label}
            </label>
          );
        })}
      </fieldset>
      <div className="flex flex-col gap-4">
        <TextField
          label="이메일"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@company.com"
          required
        />
        <TextField
          label="비밀번호"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해 주세요"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-body-md text-secondary-700">
          <input type="checkbox" name="remember" className="size-4.5 accent-primary-500" />
          로그인 상태 유지
        </label>
        <Link href="#" className="text-body-md text-primary-500 hover:text-primary-600">
          비밀번호 찾기
        </Link>
      </div>
      <Button type="submit" variant="strong" block>
        로그인
      </Button>
      <div className="flex items-center gap-3 text-body-sm text-secondary-600">
        <span aria-hidden className="h-px flex-1 bg-secondary-100" />
        또는
        <span aria-hidden className="h-px flex-1 bg-secondary-100" />
      </div>
      <p className="flex justify-center gap-1.5 text-body-md text-secondary-700">
        아직 계정이 없으신가요?
        <Link href="/signup" className="text-label-lg text-primary-500 hover:text-primary-600">
          회원가입
        </Link>
      </p>
    </form>
  );
}
