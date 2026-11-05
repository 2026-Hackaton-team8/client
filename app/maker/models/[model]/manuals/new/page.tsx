import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MakerManualRegisterPage } from "@/pages/maker-manual-register";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ params }: PageProps<"/maker/models/[model]/manuals/new">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="models" />}>
      <ManualRoute params={params} />
    </Suspense>
  );
}

async function ManualRoute({
  params,
}: Pick<PageProps<"/maker/models/[model]/manuals/new">, "params">) {
  const modelId = Number((await params).model);
  if (!Number.isInteger(modelId)) notFound();
  return <MakerManualRegisterPage modelId={modelId} />;
}
