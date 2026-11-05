import type { Equipment } from "./types";

export const equipments: Equipment[] = [
  {
    id: "eq-1",
    unityCode: "ROBOT-001",
    name: "1층 세탁실 1호기",
    model: "WM-20",
    place: "본관 1층",
    serial: "SN-31877-C",
    lastService: "2026.10.10",
  },
  {
    id: "eq-2",
    unityCode: "CNC-001",
    name: "1층 세탁실 2호기",
    model: "WM-20",
    place: "본관 1층",
    serial: "SN-31878-C",
    lastService: "2026.09.30",
  },
  {
    id: "eq-3",
    unityCode: "PUMP-001",
    name: "세탁 2라인",
    model: "WM-35",
    place: "B동 2층",
    serial: "SN-40211-A",
    lastService: "2026.08.12",
  },
  {
    id: "eq-4",
    unityCode: "COMPRESSOR-001",
    name: "B동 3호기",
    model: "WM-20",
    place: "B동 3층",
    serial: "SN-31902-C",
    lastService: "2026.07.21",
  },
  {
    id: "eq-5",
    unityCode: "ROBOT-001",
    name: "2층 탈수기",
    model: "WM-35",
    place: "본관 2층",
    serial: "SN-40388-A",
    lastService: "2026.06.02",
  },
  {
    id: "eq-6",
    unityCode: "CNC-001",
    name: "대형 건조기",
    model: "DR-50",
    place: "B동 1층",
    serial: "SN-50017-D",
    lastService: "2026.05.18",
  },
];

export function findEquipment(id: string) {
  return equipments.find((equipment) => equipment.id === id);
}
