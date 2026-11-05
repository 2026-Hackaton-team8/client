import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MakerCallDetailPage } from "@/pages/maker-call-detail";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ params }: PageProps<"/maker/calls/[id]">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="calls" />}>
      <CallRoute params={params} />
    </Suspense>
  );
}

async function CallRoute({ params }: Pick<PageProps<"/maker/calls/[id]">, "params">) {
  const requestId = Number((await params).id);
  if (!Number.isInteger(requestId)) notFound();
  return <MakerCallDetailPage requestId={requestId} />;
}
