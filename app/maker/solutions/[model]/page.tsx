import { notFound } from "next/navigation";
import { Suspense } from "react";
import { equipmentModels, findModel } from "@/entities/equipment-model";
import { MakerSolutionModelPage } from "@/pages/maker-solution-model";
import { AppHeader } from "@/widgets/app-header";

export function generateStaticParams() {
  return equipmentModels.map((model) => ({ model: model.code }));
}

export default function Page({ params }: PageProps<"/maker/solutions/[model]">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="solutions" />}>
      <ModelRoute params={params} />
    </Suspense>
  );
}

async function ModelRoute({ params }: Pick<PageProps<"/maker/solutions/[model]">, "params">) {
  const { model: code } = await params;
  const model = findModel(code);
  if (!model) notFound();
  return <MakerSolutionModelPage model={model} />;
}
