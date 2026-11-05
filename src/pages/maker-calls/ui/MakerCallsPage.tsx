import { PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { CallInbox } from "@/widgets/call-inbox";

export function MakerCallsPage() {
  return (
    <>
      <AppHeader side="maker" active="calls" />
      <PageMain>
        <CallInbox />
      </PageMain>
    </>
  );
}
