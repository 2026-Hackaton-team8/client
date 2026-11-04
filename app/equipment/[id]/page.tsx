import { notFound } from "next/navigation";
import { Suspense } from "react";
import { equipments, findEquipment } from "@/entities/equipment";
import { EquipmentDetailPage } from "@/pages/equipment-detail";
import { AppHeader } from "@/widgets/app-header";

export function generateStaticParams() {
  return equipments.map((equipment) => ({ id: equipment.id }));
}

export default function Page({ params }: PageProps<"/equipment/[id]">) {
  return (
    <Suspense fallback={<AppHeader side="user" active="equipment" />}>
      <EquipmentRoute params={params} />
    </Suspense>
  );
}

async function EquipmentRoute({ params }: Pick<PageProps<"/equipment/[id]">, "params">) {
  const { id } = await params;
  const equipment = findEquipment(id);
  if (!equipment) notFound();
  return <EquipmentDetailPage equipment={equipment} />;
}
