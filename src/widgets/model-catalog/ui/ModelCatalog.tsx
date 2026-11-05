"use client";

import Link from "next/link";
import { useState } from "react";
import { makerApi, useApi } from "@/shared/api";
import { formatShortDate, toDotDate } from "@/shared/lib";
import { LoadState, PageHeading, Placeholder, TextField } from "@/shared/ui";

const columns = ["분류", "설치 대수", "수리 이력", "최근 수리"];

export function ModelCatalog() {
  const [query, setQuery] = useState("");
  const models = useApi(makerApi.models, "maker-models");
  const keyword = query.trim().toLowerCase();
  const rows = (models.data ?? []).filter(
    (model) =>
      !keyword || model.code.toLowerCase().includes(keyword) || model.name.includes(query.trim()),
  );

  return (
    <>
      <PageHeading
        title="솔루션 초안"
        description="모델을 고르면 그 모델의 수리 이력과 솔루션을 볼 수 있어요."
        action={
          <div className="w-full sm:w-80">
            <TextField
              label="모델 검색"
              hideLabel
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="모델명이나 코드로 검색"
            />
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-collapse text-left">
          <thead>
            <tr className="border-b border-secondary-100 text-label-md text-secondary-600">
              <th scope="col" className="px-6 py-3.5 font-semibold">
                모델
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="w-28 px-6 py-3.5 font-semibold whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
              <th scope="col" className="px-6 py-3.5">
                <span className="sr-only">열기</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((model) => (
              <tr key={model.id} className="border-b border-secondary-100 last:border-b-0">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3.5">
                    <Placeholder label={`${model.code} 썸네일`} className="size-12 shrink-0" />
                    <div>
                      <p className="text-title-md text-black">{model.code}</p>
                      <p className="text-body-sm text-secondary-600">{model.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-body-md whitespace-nowrap text-black">
                  {model.category}
                </td>
                <td className="px-6 py-3.5 text-body-md text-black">{model.installedCount}대</td>
                <td className="px-6 py-3.5 text-body-md text-black">
                  {model.repairHistoryCount}건
                </td>
                <td className="px-6 py-3.5 text-body-sm text-secondary-600">
                  {model.lastRepairedAt ? formatShortDate(toDotDate(model.lastRepairedAt)) : "—"}
                </td>
                <td className="px-6 py-3.5">
                  <Link
                    href={`/maker/solutions/${model.id}`}
                    aria-label={`${model.code} 솔루션 열기`}
                    className="text-label-lg whitespace-nowrap text-primary-500 hover:text-primary-600"
                  >
                    열기 →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {models.loading || models.error ? (
          <LoadState error={models.error} />
        ) : (
          rows.length === 0 && (
            <p className="px-6 py-10 text-center text-body-md text-secondary-600">
              {keyword ? "검색한 모델이 없어요." : "아직 등록한 모델이 없어요."}
            </p>
          )
        )}
      </div>
    </>
  );
}
