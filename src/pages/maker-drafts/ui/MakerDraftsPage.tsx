import { solutionDrafts } from "@/entities/solution-draft";
import { DraftReviewBoard } from "@/features/review-solution-draft";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

export function MakerDraftsPage() {
  return (
    <>
      <AppHeader side="maker" active="drafts" />
      <PageMain>
        <PageHeading
          title="솔루션 초안"
          description="A/S 기록으로 만든 초안을 확인하고 승인하세요"
        />
        <DraftReviewBoard initialDrafts={solutionDrafts} />
      </PageMain>
    </>
  );
}
