import { notFound } from "next/navigation";
import { Suspense } from "react";
import { findServiceCall, serviceCalls } from "@/entities/service-call";
import { MakerCallDetailPage } from "@/pages/maker-call-detail";
import { AppHeader } from "@/widgets/app-header";

export function generateStaticParams() {
  return serviceCalls.map((call) => ({ id: call.id }));
}

export default function Page({ params }: PageProps<"/maker/calls/[id]">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="calls" />}>
      <CallRoute params={params} />
    </Suspense>
  );
}

async function CallRoute({ params }: Pick<PageProps<"/maker/calls/[id]">, "params">) {
  const { id } = await params;
  const call = findServiceCall(id);
  if (!call) notFound();
  return <MakerCallDetailPage call={call} />;
}
