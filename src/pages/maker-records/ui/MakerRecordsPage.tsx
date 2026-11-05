import { PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { RepairHistory } from "@/widgets/repair-history";

export function MakerRecordsPage() {
  return (
    <>
      <AppHeader side="maker" active="records" />
      <PageMain>
        <RepairHistory />
      </PageMain>
    </>
  );
}
