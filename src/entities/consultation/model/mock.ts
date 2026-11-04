import type { Consultation } from "./types";

export const recentConsultations: Consultation[] = [
  { id: "AS-1044", equipmentId: "eq-1", equipmentName: "A라인 세탁기", date: "2026.11.02" },
  { id: "AS-1043", equipmentId: "eq-2", equipmentName: "B라인 세탁기", date: "2026.11.03" },
  { id: "AS-1038", equipmentId: "eq-1", equipmentName: "A라인 세탁기", date: "2026.10.10" },
];

export const symptomOptions = ["과열", "알람 코드", "이상 소음", "진동", "배수 불량", "전원 꺼짐"];
