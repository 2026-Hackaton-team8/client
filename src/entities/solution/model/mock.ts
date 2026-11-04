import type { Solution } from "./types";

const solutions: Solution[] = [
  {
    model: "WN-20",
    title: "탈수 중 과열 경고가 뜰 때",
    approvedAt: "2026.10.30",
    steps: [
      "세탁물이 한쪽으로 쏠리지 않았는지 확인하고 다시 넣어 주세요.",
      "배수 필터를 꺼내 막힘이 없는지 확인해 주세요.",
      "모터 쪽 통풍구에 먼지가 쌓였는지 확인해 주세요.",
      "경고 코드가 다시 뜨면 화면의 코드 번호를 적어 두세요.",
    ],
  },
];

export function findSolution(model: string) {
  return solutions.find((solution) => solution.model === model);
}
