"use client";

import { RepairLevelBadge, repairLevelOf } from "@/entities/repair-record";
import { equipmentApi, useApi } from "@/shared/api";
import { toDotDate } from "@/shared/lib";
import { LoadState, PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  equipmentId: number;
};

const columns = ["수리 일자", "접수 번호", "부품", "원인 → 조치", "조치 구분", "엔지니어"];

export function EquipmentHistoryPage({ equipmentId }: Props) {
  const equipment = useApi(() => equipmentApi.get(equipmentId), `equipment:${equipmentId}`);
  const histories = useApi(
    () => equipmentApi.repairHistories(equipmentId),
    `equipment-histories:${equipmentId}`,
  );
  const rows = histories.data ?? [];

  return (
    <>
      <AppHeader side="user" active="equipment" />
      <PageMain>
        <PageHeading
          back={{ href: "/", label: "내 설비" }}
          title={equipment.data ? `${equipment.data.name} 수리 이력` : "수리 이력"}
          description={
            equipment.data &&
            `${equipment.data.model.code} · ${equipment.data.model.name} · ${equipment.data.location}`
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 border-collapse text-left">
            <thead>
              <tr className="border-b border-secondary-100 text-label-md text-secondary-600">
                {columns.map((column) => (
                  <th key={column} scope="col" className="px-6 py-3.5 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((record) => (
                <tr key={record.id} className="border-b border-secondary-100 last:border-b-0">
                  <td className="px-6 py-4 text-body-sm whitespace-nowrap text-secondary-600">
                    {toDotDate(record.repairedAt)}
                  </td>
                  <td className="px-6 py-4 text-label-lg text-black">{record.requestNo}</td>
                  <td className="px-6 py-4">
                    <p className="text-body-md text-black">{record.part.name}</p>
                    <p className="text-body-sm text-secondary-600">{record.part.code}</p>
                  </td>
                  <td className="px-6 py-4 text-body-md text-black">
                    {record.cause} → {record.solution}
                  </td>
                  <td className="px-6 py-4">
                    <RepairLevelBadge level={repairLevelOf(record.difficulty)} />
                  </td>
                  <td className="px-6 py-4 text-body-md text-secondary-700">
                    {record.engineerName ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {histories.loading || histories.error ? (
            <LoadState error={histories.error} />
          ) : (
            rows.length === 0 && (
              <p className="py-12 text-center text-body-md text-secondary-600">
                아직 이 설비의 수리 이력이 없어요.
              </p>
            )
          )}
        </div>
      </PageMain>
    </>
  );
}
