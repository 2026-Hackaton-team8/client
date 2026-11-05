import { notFound } from "next/navigation";
import { Suspense } from "react";
import { equipmentModels, findModel } from "@/entities/equipment-model";
import { manualsForModel } from "@/entities/model-manual";
import { MakerModelDetailPage } from "@/pages/maker-model-detail";
import { AppHeader } from "@/widgets/app-header";

export function generateStaticParams() {
  return equipmentModels.map((model) => ({ model: model.code }));
}

export default function Page({ params }: PageProps<"/maker/models/[model]">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="models" />}>
      <ModelRoute params={params} />
    </Suspense>
  );
}

async function ModelRoute({ params }: Pick<PageProps<"/maker/models/[model]">, "params">) {
  const { model: code } = await params;
  const model = findModel(code);
  if (!model) notFound();
  return <MakerModelDetailPage model={model} manuals={manualsForModel(model.code)} />;
}
