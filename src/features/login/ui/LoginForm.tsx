"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authApi, errorMessage, homeForRole, saveSession } from "@/shared/api";
import { Button, TextField } from "@/shared/ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const session = await authApi.login({
        loginId: String(data.get("loginId")),
        pw: String(data.get("password")),
      });
      saveSession(session, data.get("remember") === "on");
      router.push(homeForRole(session.role));
    } catch (caught) {
      setError(errorMessage(caught));
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-100 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-heading-lg text-black">로그인</h1>
        <p className="text-body-lg text-secondary-600">짚어 계정으로 로그인해 주세요.</p>
      </div>
      <div className="flex flex-col gap-4">
        <TextField
          label="아이디"
          name="loginId"
          autoComplete="username"
          placeholder="아이디를 입력해 주세요"
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
      {error && (
        <p role="alert" className="text-body-sm text-primary-600">
          {error}
        </p>
      )}
      <Button type="submit" variant="strong" block disabled={pending}>
        {pending ? "로그인 중…" : "로그인"}
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
