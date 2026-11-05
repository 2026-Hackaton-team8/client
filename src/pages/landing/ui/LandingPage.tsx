import { ButtonLink, Logo } from "@/shared/ui";

const navLinks = [
  { href: "#how", label: "서비스 소개" },
  { href: "#how", label: "이용 방법" },
  { href: "#audiences", label: "제작 업체 안내" },
];

const steps = [
  {
    no: "01",
    title: "설비 등록",
    body: "사용 중인 설비를 모델명으로 등록하면 제작 업체의 3D 모델과 매뉴얼이 연결돼요.",
  },
  {
    no: "02",
    title: "고장 부위 짚고 상담",
    body: "3D 모델에서 문제 부위를 짚으면 매뉴얼 기반 AI 상담이 바로 시작돼요.",
  },
  {
    no: "03",
    title: "담당자 호출 · 수리 기록",
    body: "해결이 안 되면 신고서로 담당자를 부르고, 수리 결과는 이력으로 남아요.",
  },
];

const audiences = [
  {
    title: "사용 업체",
    caption: "공장 · 현장 담당자",
    features: [
      "내 설비 현황과 최근 A/S 일자를 한눈에",
      "3D 모델로 고장 부위를 짚어 바로 상담",
      "상담 내역과 담당자 호출 신고서 관리",
    ],
    cta: "사용 업체로 시작하기",
    variant: "primary",
    dot: "bg-primary-300",
  },
  {
    title: "제작 업체",
    caption: "설비 제조 · A/S 담당",
    features: [
      "들어온 호출을 긴급도 순으로 확인",
      "수리 이력을 남기고 담당자 배정",
      "모델별 매뉴얼과 솔루션 초안 관리",
    ],
    cta: "제작 업체로 시작하기",
    variant: "strong",
    dot: "bg-primary-500",
  },
] as const;

const footerLinks = ["이용약관", "개인정보처리방침", "문의하기"];

const container = "mx-auto w-full max-w-7xl px-6 md:px-10";

export function LandingPage() {
  return (
    <>
      <header className="border-b border-secondary-100 bg-white">
        <div className={`${container} flex h-16 items-center gap-10`}>
          <Logo />
          <nav aria-label="주 메뉴" className="hidden gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-body-md text-secondary-700 hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex gap-2">
            <ButtonLink href="/login" variant="ghost" size="sm">
              로그인
            </ButtonLink>
            <ButtonLink href="/login" variant="strong" size="sm">
              시작하기
            </ButtonLink>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <section className="bg-primary-50 py-24">
          <div className={`${container} flex flex-col items-center gap-16 lg:flex-row`}>
            <div className="flex flex-1 flex-col items-start gap-5 break-keep">
              <span className="rounded-lg bg-primary-100 px-2 py-1 text-body-md text-primary-600">
                설비 A/S 상담 플랫폼
              </span>
              <h1 className="text-display-xl text-black">
                고장 난 곳을 짚으면,
                <br />
                해결까지 바로 이어져요
              </h1>
              <p className="text-body-lg text-secondary-700">
                3D 모델에서 문제 부위를 짚어 상담하고, 담당자 호출부터 수리 이력까지
                <br className="hidden md:block" />
                제작 업체와 한곳에서 관리하세요.
              </p>
              <div className="flex gap-3 pt-3">
                <ButtonLink href="/login" variant="strong">
                  무료로 시작하기
                </ButtonLink>
                <ButtonLink href="#how" variant="soft">
                  서비스 둘러보기
                </ButtonLink>
              </div>
            </div>
            <ConsultPreview />
          </div>
        </section>

        <section id="how" className="scroll-mt-4 bg-white py-24">
          <div className={`${container} flex flex-col gap-12`}>
            <SectionHeading
              eyebrow="이용 방법"
              title="세 단계면 충분해요"
              description="설비를 등록해 두면, 고장이 났을 때 바로 짚어서 상담을 시작할 수 있어요."
            />
            <ol className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <li
                  key={step.no}
                  className="flex flex-col gap-3 rounded-lg bg-secondary-50 px-6 py-7"
                >
                  <span className="mb-1 flex size-9 items-center justify-center rounded-full bg-primary-100 text-label-md text-primary-600">
                    {step.no}
                  </span>
                  <h3 className="text-title-lg text-black">{step.title}</h3>
                  <p className="text-body-md text-secondary-700">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="audiences" className="scroll-mt-4 bg-secondary-50 py-24">
          <div className={`${container} flex flex-col gap-12`}>
            <SectionHeading
              eyebrow="함께 쓰는 서비스"
              title="사용 업체와 제작 업체를 하나로 잇습니다"
            />
            <div className="grid gap-6 md:grid-cols-2">
              {audiences.map((audience) => (
                <article
                  key={audience.title}
                  className="flex flex-col items-start gap-5 rounded-xl border border-secondary-100 bg-white p-8"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-body-md text-secondary-600">{audience.caption}</p>
                    <h3 className="text-heading-sm text-black">{audience.title}</h3>
                  </div>
                  <ul className="flex w-full flex-col gap-3 border-b border-secondary-100 pb-5">
                    {audience.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2.5 text-body-lg text-black"
                      >
                        <span aria-hidden className={`size-1.5 rounded-full ${audience.dot}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="/login" variant={audience.variant}>
                    {audience.cta}
                  </ButtonLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className={container}>
            <div className="flex flex-col gap-6 rounded-2xl bg-primary-500 px-8 py-12 md:flex-row md:items-center md:px-14">
              <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-heading-xl text-white">
                  다음 고장, 전화 대신 짚어서 해결하세요
                </h2>
                <p className="text-body-lg text-white/80">
                  설비 등록은 1분이면 끝나요. 지금 바로 시작해 보세요.
                </p>
              </div>
              <div className="flex gap-2">
                <ButtonLink href="/login" variant="soft">
                  로그인
                </ButtonLink>
                <ButtonLink href="/login">무료로 시작하기</ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary-50 pt-10 pb-12">
        <div className={`${container} flex flex-col gap-6 md:flex-row md:justify-between`}>
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-body-md text-secondary-700">
              설비 고장 상담과 A/S 기록을 한곳에서 관리해요.
            </p>
            <p className="text-caption text-secondary-600">© 2026 짚어. All rights reserved.</p>
          </div>
          <nav aria-label="하단 메뉴" className="flex gap-6">
            {footerLinks.map((label) => (
              <a key={label} href="#" className="text-body-sm text-secondary-700 hover:text-black">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-label-md text-primary-500">{eyebrow}</p>
      <h2 className="text-heading-xl text-black">{title}</h2>
      {description && <p className="text-body-lg text-secondary-700">{description}</p>}
    </div>
  );
}

// Static mock of the consult screen: model preview with a pinned part and an AI reply.
function ConsultPreview() {
  return (
    <div
      aria-hidden
      className="flex w-full max-w-130 shrink-0 flex-col gap-4 rounded-xl border border-primary-100 bg-white p-6 shadow-[0_12px_32px_rgba(90,119,179,0.12)]"
    >
      <div className="flex items-center gap-2">
        <span className="text-title-md text-black">A라인 세탁기</span>
        <span className="text-body-md text-secondary-600">WM-20</span>
      </div>
      <div className="relative h-65 rounded-lg bg-secondary-100">
        <div className="absolute top-8.75 left-1/2 h-47.5 w-37.5 -translate-x-1/2 rounded-xl bg-secondary-300" />
        <div className="absolute top-22.5 left-1/2 size-24 -translate-x-1/2 rounded-full border-3 border-secondary-600 bg-secondary-100" />
        <div className="absolute top-16.5 left-[calc(50%+26px)] size-10 rounded-full bg-primary-300/40" />
        <div className="absolute top-19.5 left-[calc(50%+38px)] size-4 rounded-full border-3 border-white bg-primary-500" />
        <span className="absolute top-11 left-[calc(50%+68px)] rounded-md bg-primary-500 px-2.5 py-1.5 text-label-md text-white">
          도어 잠금부
        </span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg bg-primary-50 px-4 py-3">
        <span className="text-label-md text-primary-500">AI 상담</span>
        <p className="text-body-md text-black">
          도어 잠금부 센서 오류일 가능성이 높아요. 전원을 끄고 도어 래치를 확인해 보세요.
        </p>
      </div>
      <div className="flex justify-end gap-2">
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
