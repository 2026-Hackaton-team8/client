import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MakerModelDetailPage } from "@/pages/maker-model-detail";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ params }: PageProps<"/maker/models/[model]">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="models" />}>
      <ModelRoute params={params} />
    </Suspense>
  );
}

async function ModelRoute({ params }: Pick<PageProps<"/maker/models/[model]">, "params">) {
  const modelId = Number((await params).model);
  if (!Number.isInteger(modelId)) notFound();
  return <MakerModelDetailPage modelId={modelId} />;
}
