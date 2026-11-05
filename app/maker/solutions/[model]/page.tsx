import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MakerSolutionModelPage } from "@/pages/maker-solution-model";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ params }: PageProps<"/maker/solutions/[model]">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="solutions" />}>
      <ModelRoute params={params} />
    </Suspense>
  );
}

async function ModelRoute({ params }: Pick<PageProps<"/maker/solutions/[model]">, "params">) {
  const modelId = Number((await params).model);
  if (!Number.isInteger(modelId)) notFound();
  return <MakerSolutionModelPage modelId={modelId} />;
}
