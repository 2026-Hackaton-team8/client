"use client";

import Link from "next/link";
import { useState } from "react";
import { equipmentModels } from "@/entities/equipment-model";
import { manualsForModel } from "@/entities/model-manual";
import { Badge, PageHeading, Placeholder, TextField } from "@/shared/ui";

const columns = ["분류", "설치 대수", "부품", "수리 이력", "매뉴얼"];

export function ModelList() {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const rows = equipmentModels.filter(
    (model) =>
      !keyword || model.code.toLowerCase().includes(keyword) || model.name.includes(query.trim()),
  );

  return (
    <>
      <PageHeading
        title="모델 관리"
        description="우리 회사가 제공하는 설비 모델이에요. 모델을 열어 정보와 매뉴얼을 관리해요."
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
            {rows.map((model) => {
              const manuals = manualsForModel(model.code).length;
              return (
                <tr key={model.code} className="border-b border-secondary-100 last:border-b-0">
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
                  <td className="px-6 py-3.5 text-body-md text-black">{model.installs}대</td>
                  <td className="px-6 py-3.5 text-body-md text-black">{model.partCount}개</td>
                  <td className="px-6 py-3.5 text-body-md text-black">{model.repairs}건</td>
                  <td className="px-6 py-3.5">
                    {manuals > 0 ? (
                      <Badge tone="primary">{manuals}개</Badge>
                    ) : (
                      <Badge>미등록</Badge>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <Link
                      href={`/maker/models/${model.code}`}
                      aria-label={`${model.code} 상세 열기`}
                      className="text-label-lg whitespace-nowrap text-primary-500 hover:text-primary-600"
                    >
                      열기 →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-6 py-10 text-center text-body-md text-secondary-600">
            검색한 모델이 없어요.
          </p>
        )}
      </div>
    </>
  );
}
