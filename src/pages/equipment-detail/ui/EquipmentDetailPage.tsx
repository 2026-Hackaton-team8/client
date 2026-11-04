import Link from "next/link";
import { EquipmentStatusBadge, HistoryList, type Equipment } from "@/entities/equipment";
import { findSolution, SolutionChecklist } from "@/entities/solution";
import { ButtonLink, PageMain } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";

type Props = {
  equipment: Equipment;
};

export function EquipmentDetailPage({ equipment }: Props) {
  const solution = findSolution(equipment.model);
  const consultHref = `/consult?equipment=${equipment.id}`;
  const specs = [
    ["위치", `${equipment.model} - ${equipment.site}`],
    ["시리얼", equipment.serial],
    ["제작사", equipment.maker],
    ["설치일", equipment.installedAt],
  ];

  return (
    <>
      <AppHeader side="user" active="equipment" />
      <PageMain>
        <div className="flex flex-col gap-6">
          <nav aria-label="경로" className="flex gap-2 text-body-md text-secondary-600">
            <Link href="/" className="hover:text-black">
              내 설비
            </Link>
            <span aria-hidden>/</span>
            <span className="text-black">{equipment.name}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-heading-lg text-black">{equipment.name}</h1>
                <EquipmentStatusBadge status={equipment.status} />
              </div>
              <dl className="flex flex-wrap gap-x-10 gap-y-2 text-body-md">
                {specs.map(([term, value]) => (
                  <div key={term} className="flex gap-3">
                    <dt className="text-secondary-600">{term}</dt>
                    <dd className="text-black">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ButtonLink href={consultHref} size="lg">
              수리 상담
            </ButtonLink>
          </div>
        </div>

        <div className="grid items-start gap-10 xl:grid-cols-5 xl:gap-10">
          {solution && (
            <div className="xl:order-last xl:col-span-2">
              <SolutionChecklist
                solution={solution}
                footer={
                  <div className="flex flex-col gap-3">
                    <p className="text-body-md text-secondary-700">
                      모두 해 봐도 그대로라면 수리 상담을 요청하세요.
                    </p>
                    <ButtonLink href={consultHref} block>
                      수리 상담 요청하기
                    </ButtonLink>
                  </div>
                }
              />
            </div>
          )}
          <section
            className={`flex flex-col gap-6 ${solution ? "xl:col-span-3" : "xl:col-span-5"}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-title-lg text-black">고장 및 A/S 히스토리</h2>
              <span className="text-body-md text-secondary-600">
                총 {equipment.history.length}건
              </span>
            </div>
            <HistoryList items={equipment.history} />
          </section>
        </div>
      </PageMain>
    </>
  );
}
