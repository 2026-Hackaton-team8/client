"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  companyApi,
  errorMessage,
  homeForRole,
  meApi,
  updateSession,
  useApi,
  type CompanyType,
  type Role,
} from "@/shared/api";
import { Button, Panel, Select, TextField } from "@/shared/ui";

type Side = "user" | "maker";

const accountBySide: Record<Side, { role: Role; companyType: CompanyType }> = {
  user: { role: "WORKER", companyType: "USER_COMPANY" },
  maker: { role: "STAFF", companyType: "MAKER_COMPANY" },
};

const NEW_COMPANY = "new";

const options: { value: Side; title: string; caption: string; features: string[] }[] = [
  {
    value: "user",
    title: "사용 업체",
    caption: "설비를 사용하는 공장 · 현장",
    features: ["내 설비 등록과 현황 확인", "3D 모델로 고장 부위 상담", "담당자 호출 신고서 작성"],
  },
  {
    value: "maker",
    title: "제작 업체",
    caption: "설비를 만들고 A/S를 제공하는 업체",
    features: ["들어온 호출 확인과 담당자 배정", "수리 이력 기록", "모델별 3D · 매뉴얼 관리"],
  },
];

export function SelectSideForm() {
  const router = useRouter();
  const [side, setSide] = useState<Side | null>(null);
  const [companyId, setCompanyId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const selected = options.find((option) => option.value === side);
  const companyType = side ? accountBySide[side].companyType : undefined;
  const companies = useApi(
    () => (companyType ? companyApi.list(companyType) : Promise.resolve([])),
    companyType ?? "none",
  );
  const companyOptions = [
    { value: "", label: "업체를 선택해 주세요" },
    ...(companies.data ?? []).map((company) => ({
      value: String(company.id),
      label: `${company.name} · ${company.located}`,
    })),
    { value: NEW_COMPANY, label: "+ 새 업체 등록" },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!side || !companyId) return;
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const { role, companyType } = accountBySide[side];
    setPending(true);
    setError("");
    try {
      const id =
        companyId === NEW_COMPANY
          ? (
              await companyApi.create({
                type: companyType,
                name: field("companyName"),
                located: field("located"),
                businessNumber: field("businessNumber"),
                phone: field("companyPhone"),
              })
            ).id
          : Number(companyId);
      const session = await meApi.selectRole({ role, companyId: id });
      updateSession(session);
      router.push(homeForRole(session.role));
    } catch (caught) {
      setError(errorMessage(caught));
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-10">
      <fieldset className="grid w-full max-w-186 gap-6 sm:grid-cols-2">
        <legend className="sr-only">업체 유형</legend>
        {options.map((option) => {
          const checked = option.value === side;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col gap-5 rounded-xl border-2 p-7 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-500 ${
                checked
                  ? "border-primary-300 bg-primary-50 shadow-[0_8px_24px_rgba(90,119,179,0.12)]"
                  : "border-secondary-100 bg-white hover:border-secondary-300"
              }`}
            >
              <input
                type="radio"
                name="side"
                value={option.value}
                checked={checked}
                onChange={() => {
                  setSide(option.value);
                  setCompanyId("");
                }}
                className="sr-only"
              />
              <span className="flex items-start justify-between">
                <SideIcon side={option.value} active={checked} />
                <span
                  aria-hidden
                  className={`flex size-5.5 items-center justify-center rounded-full border-2 ${
                    checked ? "border-primary-500 bg-primary-500" : "border-secondary-300 bg-white"
                  }`}
                >
                  {checked && <span className="size-2 rounded-full bg-white" />}
                </span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-heading-sm text-black">{option.title}</span>
                <span className="text-body-md text-secondary-600">{option.caption}</span>
              </span>
              <span
                aria-hidden
                className={`h-px ${checked ? "bg-primary-100" : "bg-secondary-100"}`}
              />
              <ul className="flex flex-col gap-2.5">
                {option.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-body-md text-secondary-700"
                  >
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full ${checked ? "bg-primary-500" : "bg-secondary-300"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </label>
          );
        })}
      </fieldset>
      {selected && (
        <Panel tone="outline" title={`소속 ${selected.title}`} className="w-full max-w-186 gap-4">
          <Select
            label="업체"
            options={companyOptions}
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            disabled={companies.loading}
            required
          />
          {companyId === NEW_COMPANY && (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="업체명" name="companyName" maxLength={100} required />
              <TextField
                label="사업자등록번호"
                name="businessNumber"
                maxLength={50}
                placeholder="000-00-00000"
                required
              />
              <TextField label="주소" name="located" maxLength={255} required />
              <TextField
                label="대표 연락처"
                name="companyPhone"
                type="tel"
                placeholder="02-000-0000"
                required
              />
            </div>
          )}
          {error && (
            <p role="alert" className="text-body-sm text-primary-600">
              {error}
            </p>
          )}
        </Panel>
      )}
      <div className="flex w-80 flex-col items-center gap-3">
        <Button type="submit" variant="strong" block disabled={!selected || !companyId || pending}>
          {selected ? `${selected.title}로 시작하기` : "업체 유형을 선택해 주세요"}
        </Button>
        <p className="text-body-sm text-secondary-600">
          선택한 유형은 나중에 설정에서 바꿀 수 있어요.
        </p>
      </div>
    </form>
  );
}

type SideIconProps = {
  side: Side;
  active: boolean;
};

// Simple glyphs from the design: a factory for users, a gear-and-handle tool for makers.
function SideIcon({ side, active }: SideIconProps) {
  const fill = active ? "bg-primary-500" : "bg-secondary-600";
  return (
    <span
      aria-hidden
      className={`relative size-14 rounded-xl ${active ? "bg-primary-100" : "bg-secondary-50"}`}
    >
      {side === "user" ? (
        <>
          <span className={`absolute top-6 left-3.25 h-4.5 w-7.5 rounded-xs ${fill}`} />
          <span className={`absolute top-3 left-8.75 h-3.5 w-1.5 ${fill}`} />
        </>
      ) : (
        <>
          <span
            className={`absolute top-3 left-4 size-6 rounded-full border-5 ${active ? "border-primary-500" : "border-secondary-600"}`}
          />
          <span className={`absolute top-8.5 left-6.25 h-3.5 w-1.5 rounded-full ${fill}`} />
        </>
      )}
    </span>
  );
}
