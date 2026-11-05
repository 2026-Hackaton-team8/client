import type { SolutionDraft } from "./types";

export const solutionDrafts: SolutionDraft[] = [
  {
    id: "d-1",
    model: "WM-20",
    title: "탈수가 안 되고 통에 물이 남을 때",
    system: "배수",
    symptoms: ["탈수 안 됨", "통에 물 남음", "배수 시 소음"],
    steps: [
      "전원을 끄고 전면 하단 왼쪽 커버를 열어요.",
      "받침 그릇을 두고 배수 필터를 왼쪽으로 돌려 빼서 이물질을 없애요.",
      "배수 호스가 꺾이거나 눌려 있지 않은지 확인해요.",
    ],
    fallback: "담당자 호출로 안내해요. 엔지니어는 배수 펌프 임펠러(P-09)를 먼저 점검해요.",
    evidence: ["AS-1041", "AS-1038", "AS-1029", "AS-1017"],
    status: "pending",
    createdAt: "2026.11.05",
  },
];

export function findDraftForModel(model: string) {
  return solutionDrafts.find((draft) => draft.model === model);
}
