import { PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { ModelList } from "@/widgets/model-list";

export function MakerModelsPage() {
  return (
    <>
      <AppHeader side="maker" active="models" />
      <PageMain>
        <ModelList />
      </PageMain>
    </>
  );
}
