import { notFound } from "next/navigation";
import { Suspense } from "react";
import { consultations, findConsultation } from "@/entities/consultation";
import { ConsultReportPage } from "@/pages/consult-report";
import { AppHeader } from "@/widgets/app-header";

export function generateStaticParams() {
  return consultations.map((consultation) => ({ id: consultation.id }));
}

export default function Page({ params }: PageProps<"/consult/[id]/report">) {
  return (
    <Suspense fallback={<AppHeader side="user" active="consult" />}>
      <ReportRoute params={params} />
    </Suspense>
  );
}

async function ReportRoute({ params }: Pick<PageProps<"/consult/[id]/report">, "params">) {
  const { id } = await params;
  const consultation = findConsultation(id);
  if (!consultation) notFound();
  return <ConsultReportPage consultation={consultation} />;
}
