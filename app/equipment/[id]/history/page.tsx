import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EquipmentHistoryPage } from "@/pages/equipment-history";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ params }: PageProps<"/equipment/[id]/history">) {
  return (
    <Suspense fallback={<AppHeader side="user" active="equipment" />}>
      <HistoryRoute params={params} />
    </Suspense>
  );
}

async function HistoryRoute({ params }: Pick<PageProps<"/equipment/[id]/history">, "params">) {
  const equipmentId = Number((await params).id);
  if (!Number.isInteger(equipmentId)) notFound();
  return <EquipmentHistoryPage equipmentId={equipmentId} />;
}
