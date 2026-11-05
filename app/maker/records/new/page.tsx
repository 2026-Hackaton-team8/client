import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { MakerRepairRecordPage } from "@/pages/maker-repair-record";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ searchParams }: PageProps<"/maker/records/new">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="records" />}>
      <RecordRoute searchParams={searchParams} />
    </Suspense>
  );
}

// A record is always written for one call, opened from that call after the visit.
async function RecordRoute({
  searchParams,
}: Pick<PageProps<"/maker/records/new">, "searchParams">) {
  const { call } = await searchParams;
  if (typeof call !== "string") redirect("/maker/records");
  const requestId = Number(call);
  if (!Number.isInteger(requestId)) notFound();
  return <MakerRepairRecordPage requestId={requestId} />;
}
