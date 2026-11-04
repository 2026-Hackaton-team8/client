import { equipmentModels } from "@/entities/equipment-model";
import { ModelManager } from "@/features/manage-equipment-models";
import { PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

export function MakerModelsPage() {
  return (
    <>
      <AppHeader side="maker" active="models" />
      <PageMain>
        <ModelManager initialModels={equipmentModels} />
      </PageMain>
    </>
  );
}
