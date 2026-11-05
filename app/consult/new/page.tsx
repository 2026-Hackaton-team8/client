import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ConsultStartPage } from "@/pages/consult-start";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ searchParams }: PageProps<"/consult/new">) {
  return (
    <Suspense fallback={<AppHeader side="user" active="equipment" />}>
      <StartRoute searchParams={searchParams} />
    </Suspense>
  );
}

// A consultation always starts from one of my equipments.
async function StartRoute({ searchParams }: Pick<PageProps<"/consult/new">, "searchParams">) {
  const equipmentId = Number((await searchParams).equipment);
  if (!Number.isInteger(equipmentId) || equipmentId <= 0) redirect("/");
  return <ConsultStartPage equipmentId={equipmentId} />;
}
