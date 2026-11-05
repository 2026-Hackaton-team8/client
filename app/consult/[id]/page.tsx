import { notFound } from "next/navigation";
import { Suspense } from "react";
import { consultations, findConsultation } from "@/entities/consultation";
import { findEquipment } from "@/entities/equipment";
import { ConsultDetailPage } from "@/pages/consult-detail";
import { AppHeader } from "@/widgets/app-header";

export function generateStaticParams() {
  return consultations.map((consultation) => ({ id: consultation.id }));
}

export default function Page({ params }: PageProps<"/consult/[id]">) {
  return (
    <Suspense fallback={<AppHeader side="user" active="consult" />}>
      <ConsultRoute params={params} />
    </Suspense>
  );
}

async function ConsultRoute({ params }: Pick<PageProps<"/consult/[id]">, "params">) {
  const { id } = await params;
  const consultation = findConsultation(id);
  const equipment = consultation && findEquipment(consultation.equipmentId);
  if (!consultation || !equipment) notFound();
  return <ConsultDetailPage consultation={consultation} equipment={equipment} />;
}
