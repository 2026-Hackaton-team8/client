import { notFound } from "next/navigation";
import { Suspense } from "react";
import { findServiceCall, serviceCalls } from "@/entities/service-call";
import { MakerRepairRecordPage } from "@/pages/maker-repair-record";
import { AppHeader } from "@/widgets/app-header";

export default function Page({ searchParams }: PageProps<"/maker/records">) {
  return (
    <Suspense fallback={<AppHeader side="maker" active="records" />}>
      <RecordRoute searchParams={searchParams} />
    </Suspense>
  );
}

// Without ?call=, the tab opens the newest call that still needs a repair record.
async function RecordRoute({ searchParams }: Pick<PageProps<"/maker/records">, "searchParams">) {
  const { call: callId } = await searchParams;
  const call =
    typeof callId === "string"
      ? findServiceCall(callId)
      : serviceCalls.find((item) => item.status === "new");
  if (!call) notFound();
  return <MakerRepairRecordPage call={call} />;
}
