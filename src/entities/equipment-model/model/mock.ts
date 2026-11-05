import type { EquipmentModel, ModelPart } from "./types";

const washerParts: ModelPart[] = [
  { code: "P-03", name: "도어 잠금장치" },
  { code: "P-07", name: "배수 필터" },
  { code: "P-09", name: "배수 펌프" },
  { code: "P-10", name: "배수 호스" },
  { code: "P-12", name: "구동 모터" },
];

const maker = "[설비 제공 업체명]";

export const equipmentModels: EquipmentModel[] = [
  {
    code: "WM-20",
    unityCode: "PUMP-001",
    name: "산업용 세탁기 20kg",
    category: "산업용 세탁기",
    maker,
    installs: 31,
    repairs: 42,
    approvedSolutions: 5,
    pendingDrafts: 2,
    lastRepair: "2026.11.04",
    partCount: 14,
    parts: washerParts,
  },
  {
    code: "WM-35",
    unityCode: "ROBOT-001",
    name: "산업용 세탁기 35kg",
    category: "산업용 세탁기",
    maker,
    installs: 18,
    repairs: 27,
    approvedSolutions: 3,
    pendingDrafts: 1,
    lastRepair: "2026.11.03",
    partCount: 16,
    parts: washerParts,
  },
  {
    code: "WM-20S",
    unityCode: "CNC-001",
    name: "산업용 세탁기 20kg 스팀형",
    category: "산업용 세탁기",
    maker,
    installs: 9,
    repairs: 8,
    approvedSolutions: 1,
    pendingDrafts: 0,
    lastRepair: "2026.10.22",
    partCount: 15,
    parts: washerParts,
  },
  {
    code: "DR-50",
    unityCode: "COMPRESSOR-001",
    name: "대형 건조기 50kg",
    category: "산업용 건조기",
    maker,
    installs: 12,
    repairs: 15,
    approvedSolutions: 2,
    pendingDrafts: 0,
    lastRepair: "2026.09.30",
    partCount: 11,
    parts: [],
  },
  {
    code: "IR-12",
    unityCode: "CNC-001",
    name: "롤러 다림질기",
    category: "다림질기",
    maker,
    installs: 6,
    repairs: 4,
    approvedSolutions: 0,
    pendingDrafts: 0,
    lastRepair: "2026.08.14",
    partCount: 9,
    parts: [],
  },
];

export function findModel(code: string) {
  return equipmentModels.find((model) => model.code === code);
}
