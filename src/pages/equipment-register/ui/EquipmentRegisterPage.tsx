import { RegisterEquipmentForm } from "@/features/register-equipment";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

export function EquipmentRegisterPage() {
  return (
    <>
      <AppHeader side="user" active="equipment" />
      <PageMain>
        <PageHeading
          back={{ href: "/", label: "내 설비" }}
          title="설비 등록"
          description="공장에서 사용 중인 설비를 모델명으로 등록해요."
        />
        <RegisterEquipmentForm />
      </PageMain>
    </>
  );
}
