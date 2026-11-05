import { PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { ConsultHistory } from "@/widgets/consult-history";

export function ConsultListPage() {
  return (
    <>
      <AppHeader side="user" active="consult" />
      <PageMain>
        <ConsultHistory />
      </PageMain>
    </>
  );
}
