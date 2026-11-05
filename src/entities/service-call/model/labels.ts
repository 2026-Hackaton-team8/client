import type {
  CallReason,
  EquipmentState,
  RequestDetailResponse,
  RequestStatus,
} from "@/shared/api";

export const requestStatusLabels: Record<RequestStatus, string> = {
  RECEIVED: "새 호출",
  ASSIGNED: "엔지니어 배정됨",
  COMPLETED: "수리 완료",
  SELF_RESOLVED: "자가 해결",
};

export const callReasonLabels: Record<CallReason, string> = {
  SOLUTION_FAILED: "솔루션 실패",
  NEEDS_EXPERT: "전문 작업",
  LOW_CONFIDENCE: "확신 부족",
  NO_HISTORY: "이력 없음",
};

export const equipmentStateLabels: Record<EquipmentState, string> = {
  STOPPED: "완전히 멈춤",
  PARTIAL: "일부만 가동",
  NORMAL: "정상 가동",
};

// The repair record opens once an assigned call's visit time has passed.
export function isVisitDue(request: Pick<RequestDetailResponse, "status" | "visitAt">) {
  return (
    request.status === "ASSIGNED" && !!request.visitAt && new Date(request.visitAt) <= new Date()
  );
}
