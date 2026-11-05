"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { equipmentApi, errorMessage, modelApi, useApi } from "@/shared/api";
import { Button, ButtonLink, LoadState, Panel, TextField, UnityViewer } from "@/shared/ui";

export function RegisterEquipmentForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState<number>();
  // The result list shows while typing and closes once a model is picked.
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // Wait for typing to pause before searching.
  useEffect(() => {
    const timer = setTimeout(() => setKeyword(query.trim()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useApi(
    () => (keyword ? modelApi.search(keyword) : Promise.resolve([])),
    `models:${keyword}`,
  );
  const selected = useApi(
    () => (selectedId ? modelApi.get(selectedId) : Promise.resolve(undefined)),
    `model:${selectedId}`,
  );
  const model = selectedId ? selected.data : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    setPending(true);
    setError("");
    try {
      await equipmentApi.create({
        modelId: selectedId,
        name: field("name"),
        location: field("location"),
        serialNumber: field("serialNumber") || undefined,
      });
      router.push("/");
    } catch (caught) {
      setError(errorMessage(caught));
      setPending(false);
    }
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
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedId(undefined);
                setOpen(true);
              }}
              onFocus={() => setOpen(!selectedId)}
              placeholder="모델명이나 코드로 검색"
              aria-describedby="model-search-hint"
            />
            {!open ? null : results.error ? (
              <LoadState error={results.error} className="py-3" />
            ) : (
              !!results.data?.length && (
                <ul
                  aria-label="검색 결과"
                  className="overflow-hidden rounded-lg border-2 border-secondary-100"
                >
                  {results.data.map((result) => {
                    const isSelected = result.id === selectedId;
                    return (
                      <li key={result.id} className="border-b border-secondary-100 last:border-b-0">
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedId(result.id);
                            setQuery(`${result.code} · ${result.name}`);
                            setOpen(false);
                          }}
                          className={`flex w-full cursor-pointer gap-2 px-4 py-2.5 text-left text-body-md ${
                            isSelected ? "bg-secondary-50" : "bg-white hover:bg-secondary-50"
                          }`}
                        >
                          <span className="font-semibold text-black">{result.code}</span>
                          <span className="text-secondary-700">
                            {result.name} · {result.makerCompanyName}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )
            )}
            {open && keyword && !results.loading && results.data?.length === 0 && (
              <p className="text-body-sm text-secondary-600">검색한 모델이 없어요.</p>
            )}
            <p id="model-search-hint" className="text-label-md font-normal text-secondary-600">
              설비 제공 업체가 등록한 모델 목록에서 검색해요.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="설비 이름"
              name="name"
              maxLength={100}
              placeholder="예: 1층 세탁실 1호기"
              required
            />
            <TextField
              label="설치 위치"
              name="location"
              maxLength={100}
              placeholder="예: 본관 1층"
              required
            />
            <TextField
              label="시리얼 번호"
              name="serialNumber"
              maxLength={50}
              placeholder="예: SN-31877-C"
            />
          </div>
          {error && (
            <p role="alert" className="text-body-sm text-primary-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <ButtonLink href="/" variant="ghost">
              취소
            </ButtonLink>
            <Button type="submit" disabled={!selectedId || pending}>
              {pending ? "등록하는 중…" : "등록"}
            </Button>
          </div>
        </Panel>
      </form>
      <aside className="shrink-0 lg:w-90">
        <Panel title="선택한 모델" className="gap-4">
          {!selectedId ? (
            <p className="text-body-md text-secondary-600">검색 결과에서 모델을 골라 주세요.</p>
          ) : !model ? (
            <LoadState error={selected.error} />
          ) : (
            <>
              <UnityViewer
                label={`${model.code} 3D 미리보기`}
                equipmentCode={model.modelFileKey}
                className="h-80"
              />
              <p className="text-center text-label-md font-normal text-secondary-600">
                3D 미리보기 · 드래그로 회전
              </p>
              <dl className="flex flex-col gap-2.5 text-body-md">
                {[
                  ["모델", model.code],
                  ["분류", model.category],
                  ["제공 업체", model.makerCompanyName],
                  ["부품", `${model.partCount}개`],
                  ["수리 이력", `같은 모델 ${model.repairHistoryCount}건`],
                ].map(([label, value]) => (
                  <div key={label} className="flex">
                    <dt className="w-22 shrink-0 text-secondary-600">{label}</dt>
                    <dd className="text-black">{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </Panel>
      </aside>
    </div>
  );
}
