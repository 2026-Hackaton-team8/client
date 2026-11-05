import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ConsultDetailPage } from "@/pages/consult-detail";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ params }: PageProps<"/consult/[id]">) {
  return (
    <Suspense fallback={<AppHeader side="user" active="equipment" />}>
      <ConsultRoute params={params} />
    </Suspense>
  );
}

async function ConsultRoute({ params }: Pick<PageProps<"/consult/[id]">, "params">) {
  const consultationId = Number((await params).id);
  if (!Number.isInteger(consultationId)) notFound();
  return <ConsultDetailPage consultationId={consultationId} />;
}
