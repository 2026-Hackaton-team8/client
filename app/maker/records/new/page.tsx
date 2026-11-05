import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { findServiceCall } from "@/entities/service-call";
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
  const { call: callId } = await searchParams;
  if (typeof callId !== "string") redirect("/maker/records");
  const call = findServiceCall(callId);
  if (!call) notFound();
  return <MakerRepairRecordPage call={call} />;
}
