"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { equipmentModels } from "@/entities/equipment-model";
import { Button, ButtonLink, Panel, TextField, UnityViewer } from "@/shared/ui";

export function RegisterEquipmentForm() {
  const router = useRouter();
  const [query, setQuery] = useState("WM-20");
  const [selectedCode, setSelectedCode] = useState("WM-20");
  const results = query.trim()
    ? equipmentModels.filter((model) =>
        model.code.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : [];
  const selected = equipmentModels.find((model) => model.code === selectedCode);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <form onSubmit={handleSubmit} className="min-w-0 flex-1">
        <Panel tone="plain" className="gap-6">
          <div className="flex flex-col gap-2">
            <TextField
              label="모델명"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="모델명으로 검색"
              aria-describedby="model-search-hint"
            />
            {results.length > 0 && (
              <ul
                aria-label="검색 결과"
                className="overflow-hidden rounded-lg border-2 border-secondary-100"
              >
                {results.map((model) => {
                  const isSelected = model.code === selectedCode;
                  return (
                    <li key={model.code} className="border-b border-secondary-100 last:border-b-0">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedCode(model.code)}
                        className={`flex w-full cursor-pointer gap-2 px-4 py-2.5 text-left text-body-md ${
                          isSelected ? "bg-secondary-50" : "bg-white hover:bg-secondary-50"
                        }`}
                      >
                        <span className="font-semibold text-black">{model.code}</span>
                        <span className="text-secondary-700">
                          {model.name} · {model.maker}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <p id="model-search-hint" className="text-label-md font-normal text-secondary-600">
              설비 제공 업체가 등록한 모델 목록에서 검색해요.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="설비 이름" name="name" placeholder="예: 1층 세탁실 1호기" required />
            <TextField label="설치 위치" name="place" placeholder="예: 본관 1층" />
          </div>
          <div className="flex justify-end gap-2">
            <ButtonLink href="/" variant="ghost">
              취소
            </ButtonLink>
            <Button type="submit" disabled={!selected}>
              등록
            </Button>
          </div>
        </Panel>
      </form>
      <aside className="shrink-0 lg:w-90">
        <Panel title="선택한 모델" className="gap-4">
          {selected ? (
            <>
              <UnityViewer
                label={`${selected.code} 3D 미리보기`}
                equipmentCode={selected.unityCode}
                className="h-80"
              />
              <p className="text-center text-label-md font-normal text-secondary-600">
                3D 미리보기 · 드래그로 회전
              </p>
              <dl className="flex flex-col gap-2.5 text-body-md">
                {[
                  ["모델", selected.code],
                  ["분류", selected.category],
                  ["부품", `${selected.partCount}개 (3D 기준)`],
                  ["수리 이력", `같은 모델 ${selected.repairs}건`],
                ].map(([label, value]) => (
                  <div key={label} className="flex">
                    <dt className="w-22 shrink-0 text-secondary-600">{label}</dt>
                    <dd className="text-black">{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <p className="text-body-md text-secondary-600">검색 결과에서 모델을 골라 주세요.</p>
          )}
        </Panel>
      </aside>
    </div>
  );
}
