"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, TextField } from "@/shared/ui";

const terms = [
  { key: "service", label: "[필수] 서비스 이용약관 동의" },
  { key: "privacy", label: "[필수] 개인정보 수집 및 이용 동의" },
] as const;

type TermKey = (typeof terms)[number]["key"];

const checkboxStyles = "size-4.5 shrink-0 cursor-pointer accent-primary-500";

export function SignupForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({
    service: false,
    privacy: false,
  });
  const [codeSent, setCodeSent] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const allAgreed = terms.every((term) => agreed[term.key]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("passwordConfirm")) {
      setPasswordError(true);
      return;
    }
    // No auth API yet; the company type is picked on the next screen.
    router.push("/onboarding");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-100 flex-col gap-5">
      <div className="flex flex-col gap-1.5 pb-2">
        <h1 className="text-heading-lg text-black">회원가입</h1>
        <p className="text-body-lg text-secondary-600">업체 정보는 가입 후 첫 화면에서 선택해요.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="이름" name="name" autoComplete="name" placeholder="홍길동" required />
          <TextField
            label="회사명"
            name="company"
            autoComplete="organization"
            placeholder="예: 짚어산업"
            required
          />
        </div>
        <TextField
          label="이메일"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@company.com"
          required
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <TextField
              label="휴대폰 번호"
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="numeric"
              placeholder="010-0000-0000"
              required
            />
            <Button variant="soft" onClick={() => setCodeSent(true)} className="h-12">
              {codeSent ? "다시 받기" : "인증번호 받기"}
            </Button>
          </div>
          {codeSent && (
            <p role="status" className="text-label-md font-normal text-secondary-600">
              인증번호를 보냈어요.
            </p>
          )}
        </div>
        <TextField
          label="비밀번호"
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="영문, 숫자 포함 8자 이상"
          required
        />
        <TextField
          label="비밀번호 확인"
          type="password"
          name="passwordConfirm"
          autoComplete="new-password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          hint={passwordError ? "비밀번호가 일치하지 않아요." : undefined}
          onChange={() => setPasswordError(false)}
          required
        />
      </div>
      <fieldset className="flex flex-col gap-3 rounded-lg bg-secondary-50 p-4">
        <legend className="sr-only">약관 동의</legend>
        <label className="flex cursor-pointer items-center gap-2 text-label-lg text-black">
          <input
            type="checkbox"
            checked={allAgreed}
            onChange={(event) =>
              setAgreed({ service: event.target.checked, privacy: event.target.checked })
            }
            className={checkboxStyles}
          />
          전체 동의
        </label>
        <span aria-hidden className="h-px bg-secondary-100" />
        {terms.map((term) => (
          <div key={term.key} className="flex items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-body-md text-secondary-700">
              <input
                type="checkbox"
                checked={agreed[term.key]}
                onChange={(event) =>
                  setAgreed((prev) => ({ ...prev, [term.key]: event.target.checked }))
                }
                className={checkboxStyles}
              />
              {term.label}
            </label>
            <Link href="#" className="text-body-sm text-secondary-600 hover:text-black">
              보기
            </Link>
          </div>
        ))}
      </fieldset>
      <Button type="submit" variant="strong" block disabled={!allAgreed}>
        가입하기
      </Button>
      <p className="flex justify-center gap-1.5 text-body-md text-secondary-700">
        이미 계정이 있으신가요?
        <Link href="/login" className="text-label-lg text-primary-500 hover:text-primary-600">
          로그인
        </Link>
      </p>
    </form>
  );
}
