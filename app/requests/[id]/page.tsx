import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RequestDetailPage } from "@/pages/request-detail";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ params }: PageProps<"/requests/[id]">) {
  return (
    <Suspense fallback={<AppHeader side="user" active="consult" />}>
      <RequestRoute params={params} />
    </Suspense>
  );
}

async function RequestRoute({ params }: Pick<PageProps<"/requests/[id]">, "params">) {
  const requestId = Number((await params).id);
  if (!Number.isInteger(requestId)) notFound();
  return <RequestDetailPage requestId={requestId} />;
}
