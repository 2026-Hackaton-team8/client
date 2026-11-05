import { PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { ModelCatalog } from "@/widgets/model-catalog";

export function MakerSolutionsPage() {
  return (
    <>
      <AppHeader side="maker" active="solutions" />
      <PageMain>
        <ModelCatalog />
      </PageMain>
    </>
  );
}
