import type { AsRequest } from "./types";

export const asRequests: AsRequest[] = [
  {
    id: "AS-1044",
    equipment: "A라인 세탁기 WN-20",
    part: "구동 모터",
    company: "대성세탁",
    date: "2026.11.04",
    status: "received",
    symptoms: ["과열", "알람 코드"],
    description: "탈수 20분 후 E-21 과열 경고가 반복돼요. 솔루션 4단계 모두 해 봤어요.",
    history: [
      { id: "p1", kind: "fault", date: "2026.11.02", title: "탈수 중 과열 경고", by: "대성세탁" },
      {
        id: "p2",
        kind: "service",
        date: "2025.12.04",
        title: "모터 베어링 교체",
        note: "고회전 시 소음. 앞쪽 베어링 교체.",
        by: "김엔지니어",
      },
    ],
  },
  {
    id: "AS-1043",
    equipment: "B라인 세탁기 WN-20",
    part: "도어 락",
    company: "대성세탁",
    date: "2026.11.03",
    status: "progress",
    symptoms: ["전원 꺼짐"],
    description: "도어가 잠기지 않아 세탁이 시작되지 않아요.",
    history: [
      { id: "p1", kind: "service", date: "2026.09.02", title: "정기 점검", by: "이엔지니어" },
    ],
  },
  {
    id: "AS-1038",
    equipment: "A라인 세탁기 WN-20",
    part: "배수 펌프",
    company: "대성세탁",
    date: "2026.10.10",
    status: "done",
    symptoms: ["배수 불량"],
    description: "배수가 늦어 다음 공정이 밀려요.",
    history: [
      { id: "p1", kind: "service", date: "2026.10.10", title: "배수 필터 교체", by: "김엔지니어" },
    ],
    report: "배수 필터 막힘으로 배수 지연. 필터 교체 후 3회 연속 정상 배수 확인.",
  },
  {
    id: "AS-1031",
    equipment: "대형 건조기 DR-35",
    part: "히터",
    company: "한빛린넨",
    date: "2026.09.15",
    status: "done",
    symptoms: ["전원 꺼짐"],
    description: "건조 중 히터가 꺼지고 다시 켜지지 않아요.",
    history: [],
    report: "온도 센서 접점 마모. 센서 교체.",
  },
];
