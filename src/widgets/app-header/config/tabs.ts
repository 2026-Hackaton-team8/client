export type HeaderTab = {
  key: string;
  label: string;
  // No href means the screen isn't built yet; the tab renders disabled.
  href?: string;
};

export const userTabs: HeaderTab[] = [
  { key: "equipment", label: "내 설비", href: "/" },
  { key: "consult", label: "상담 내역", href: "/consult" },
];

export const makerTabs: HeaderTab[] = [
  { key: "calls", label: "호출 수신함", href: "/maker/calls" },
  { key: "records", label: "수리 이력", href: "/maker/records" },
  { key: "solutions", label: "솔루션 초안", href: "/maker/solutions" },
  { key: "models", label: "모델 관리" },
];

export const headerUsers = {
  user: "[이용 기업명] · 홍길동",
  maker: "[설비 제공 업체명] · 김담당",
};
