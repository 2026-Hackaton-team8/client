import { asRequests } from "@/entities/as-request";
import { RequestBoard } from "@/features/process-as-request";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

export function MakerRequestsPage() {
  return (
    <>
      <AppHeader side="maker" active="requests" />
      <PageMain>
        <PageHeading title="A/S 요청 기록" description="사용 업체의 수리 상담이 이곳에 접수돼요" />
        <RequestBoard initialRequests={asRequests} />
      </PageMain>
    </>
  );
}
