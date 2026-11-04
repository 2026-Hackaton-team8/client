import type { SolutionDraft } from "./types";

export const solutionDrafts: SolutionDraft[] = [
  {
    id: "d1",
    model: "WN-20",
    date: "2026.11.04",
    title: "탈수 중 과열 경고가 뜰 때",
    steps: [
      "세탁물 쏠림 확인 후 다시 넣기",
      "배수 필터 막힘 확인",
      "모터 통풍구 먼지 확인",
      "경고 코드 번호 기록",
    ],
    sources: [
      { id: "AS-1038", summary: "배수 필터 막힘 → 교체" },
      { id: "AS-0991", summary: "세탁물 쏠림 → 재배치 안내" },
      { id: "AS-0954", summary: "통풍구 먼지 → 청소" },
    ],
    approved: false,
  },
  {
    id: "d2",
    model: "DR-35",
    date: "2026.11.03",
    title: "건조기가 꺼지고 켜지지 않을 때",
    steps: [
      "차단기와 전원 플러그 확인",
      "린트 필터 청소 후 5분 대기",
      "도어를 끝까지 닫고 다시 시작",
    ],
    sources: [
      { id: "AS-1031", summary: "온도 센서 접점 마모 → 교체" },
      { id: "AS-0977", summary: "과열 차단 → 리셋" },
    ],
    approved: false,
  },
  {
    id: "d3",
    model: "WN-20",
    date: "2026.10.30",
    title: "배수가 늦을 때",
    steps: ["배수 필터 꺼내 세척", "배수 호스 꺾임 확인", "펌프 소음이 나면 상담 요청"],
    sources: [
      { id: "AS-1038", summary: "필터 막힘 → 교체" },
      { id: "AS-0912", summary: "호스 꺾임 → 정리" },
    ],
    approved: true,
  },
];
