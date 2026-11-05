import { PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
import { EquipmentBoard } from "@/widgets/equipment-board";

export function UserMainPage() {
  return (
    <>
      <AppHeader side="user" active="equipment" />
      <PageMain>
        <EquipmentBoard />
      </PageMain>
    </>
  );
}
