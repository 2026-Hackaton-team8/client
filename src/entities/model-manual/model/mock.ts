import type { ModelManual } from "./types";

export const modelManuals: ModelManual[] = [
  {
    id: "m-1",
    model: "WM-20",
    title: "배수 계통 점검 매뉴얼",
    entries: [
      {
        problem: "탈수가 안 되고 통에 물이 남아 있어요.",
        solution: "전원을 끄고 전면 하단 왼쪽 커버를 열어 배수 필터를 빼서 이물질을 없애요.",
      },
      {
        problem: '배수할 때 "웅" 소리만 나고 물이 안 빠져요.',
        solution: "배수 호스가 꺾이거나 눌려 있지 않은지 확인하고, 계속되면 담당자를 호출해요.",
      },
    ],
    createdAt: "2026.10.02",
  },
  {
    id: "m-2",
    model: "WM-20",
    title: "도어 잠김 오류 대응",
    entries: [
      {
        problem: "도어 잠김 표시가 깜빡이고 시작이 안 돼요.",
        solution: "도어를 끝까지 닫은 뒤 전원을 껐다 켜요. 도어 걸쇠에 이물질이 있으면 닦아 내요.",
      },
    ],
    createdAt: "2026.08.21",
  },
  {
    id: "m-3",
    model: "WM-35",
    title: "진동·소음 점검 매뉴얼",
    entries: [
      {
        problem: "가동 중에 진동이 심해요.",
        solution: "세탁물이 한쪽으로 몰리지 않았는지 보고, 수평 조절 다리를 다시 맞춰요.",
      },
    ],
    createdAt: "2026.09.14",
  },
];

export function manualsForModel(model: string) {
  return modelManuals.filter((manual) => manual.model === model);
}
