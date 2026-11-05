import type { EquipmentModel } from "@/entities/equipment-model";
import { RegisterManualForm } from "@/features/register-manual";
import { PageHeading, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  model: EquipmentModel;
};

export function MakerManualRegisterPage({ model }: Props) {
  return (
    <>
      <AppHeader side="maker" active="models" />
      <PageMain>
        <PageHeading
          back={{ href: `/maker/models/${model.code}`, label: `${model.code} · ${model.name}` }}
          title="매뉴얼 등록"
          description="자주 생기는 문제 상황과 해결 방안을 짝지어 적어 주세요. 필요한 만큼 추가할 수 있어요."
        />
        <RegisterManualForm model={model.code} />
      </PageMain>
    </>
  );
}
