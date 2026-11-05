import { LoginForm } from "@/features/login";
import { Logo } from "@/shared/ui";

const highlights = [
  { title: "3D 상담", body: "문제 부위를 직접 짚어 설명해요" },
  { title: "담당자 호출", body: "신고서 한 장으로 제작 업체에 전달" },
  { title: "수리 이력", body: "A/S 기록이 설비별로 쌓여요" },
];

export function LoginPage() {
  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-160 shrink-0 flex-col bg-primary-50 px-20 py-12 lg:flex">
        <Logo />
        <div className="flex flex-1 flex-col justify-center gap-4">
          <p className="text-heading-xl text-black">
            고장 난 곳을 짚으면,
            <br />
            해결까지 바로 이어져요
          </p>
          <p className="text-body-lg text-secondary-700">
            설비 고장 상담과 A/S 기록을 한곳에서 관리해요.
          </p>
          <ul className="flex flex-col gap-3 pt-6">
            {highlights.map((item) => (
              <li
                key={item.title}
                className="flex items-center gap-3 rounded-lg border border-primary-100 bg-white px-4 py-3.5"
              >
                <span aria-hidden className="size-2 rounded-full bg-primary-300" />
                <span className="text-label-lg text-black">{item.title}</span>
                <span className="text-body-md text-secondary-700">{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-body-sm text-secondary-600">© 2026 짚어</p>
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-12">
        <div className="lg:hidden">
          <Logo />
        </div>
        <LoginForm />
      </main>
    </div>
  );
}
