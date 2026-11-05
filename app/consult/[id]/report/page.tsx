import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ConsultReportPage } from "@/pages/consult-report";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ params }: PageProps<"/consult/[id]/report">) {
  return (
    <Suspense fallback={<AppHeader side="user" active="equipment" />}>
      <ReportRoute params={params} />
    </Suspense>
  );
}

async function ReportRoute({ params }: Pick<PageProps<"/consult/[id]/report">, "params">) {
  const consultationId = Number((await params).id);
  if (!Number.isInteger(consultationId)) notFound();
  return <ConsultReportPage consultationId={consultationId} />;
}
