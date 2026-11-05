import { SelectSideForm } from "@/features/select-side";
import { Logo } from "@/shared/ui";
import { OnboardingUser } from "./OnboardingUser";

export function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-secondary-50">
      <header className="border-b border-secondary-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <Logo />
          <OnboardingUser />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="flex flex-col items-center gap-2 text-center break-keep">
          <p className="text-label-lg text-primary-500">가입을 환영해요!</p>
          <h1 className="text-heading-xl text-black">어떤 업체로 이용하시나요?</h1>
          <p className="text-body-lg text-secondary-700">
            선택한 유형에 맞춰 첫 화면과 메뉴가 구성돼요.
          </p>
        </div>
        <SelectSideForm />
      </main>
    </div>
  );
}
