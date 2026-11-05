import { notFound } from "next/navigation";
import { Suspense } from "react";
import { equipmentModels, findModel } from "@/entities/equipment-model";
import { MakerManualRegisterPage } from "@/pages/maker-manual-register";
import { AppHeader } from "@/widgets/app-header";

export function generateStaticParams() {
  return equipmentModels.map((model) => ({ model: model.code }));
}

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
  const { model: code } = await params;
  const model = findModel(code);
  if (!model) notFound();
  return <MakerManualRegisterPage model={model} />;
}
