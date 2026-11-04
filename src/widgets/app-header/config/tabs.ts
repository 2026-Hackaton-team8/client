export type HeaderTab = {
  key: string;
  label: string;
  href: string;
};

export const userTabs: HeaderTab[] = [
  { key: "equipment", label: "내 설비", href: "/" },
  { key: "consult", label: "상담 내역", href: "/consult" },
];

export const makerTabs: HeaderTab[] = [
  { key: "requests", label: "A/S 요청 기록", href: "/maker/requests" },
  { key: "drafts", label: "솔루션 초안", href: "/maker/drafts" },
  { key: "models", label: "모델링 리스트", href: "/maker/models" },
];
