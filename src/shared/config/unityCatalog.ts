// Equipment and parts shipped in the Unity build (same list Unity sends as `unity-equipment-catalog`).

export type UnityPart = { partCode: string; name: string };
export type UnityEquipment = { equipmentCode: string; name: string; parts: UnityPart[] };

export const unityCatalog: UnityEquipment[] = [
  {
    equipmentCode: "ROBOT-001",
    name: "산업용 로봇",
    parts: [
      { partCode: "ROBOT-001:BASE", name: "회전 베이스" },
      { partCode: "ROBOT-001:ELBOW", name: "팔꿈치 관절" },
      { partCode: "ROBOT-001:FOREARM", name: "하부 암" },
      { partCode: "ROBOT-001:GRIPPER", name: "그리퍼" },
      { partCode: "ROBOT-001:MOTOR_COVER", name: "모터 커버" },
      { partCode: "ROBOT-001:SHOULDER", name: "어깨 관절" },
      { partCode: "ROBOT-001:UPPER_ARM", name: "상부 암" },
      { partCode: "ROBOT-001:WRIST", name: "손목 관절" },
    ],
  },
  {
    equipmentCode: "CNC-001",
    name: "CNC 가공기",
    parts: [
      { partCode: "CNC-001:CONTROL_PANEL", name: "제어 패널" },
      { partCode: "CNC-001:COOLING_UNIT", name: "냉각 장치" },
      { partCode: "CNC-001:DOOR", name: "전면 보호 도어" },
      { partCode: "CNC-001:FRAME", name: "본체 프레임" },
      { partCode: "CNC-001:GUIDE_RAIL", name: "이송 레일" },
      { partCode: "CNC-001:SPINDLE", name: "스핀들" },
      { partCode: "CNC-001:TOOL_HOLDER", name: "공구 홀더" },
      { partCode: "CNC-001:WORK_TABLE", name: "작업 테이블" },
    ],
  },
  {
    equipmentCode: "PUMP-001",
    name: "펌프",
    parts: [
      { partCode: "PUMP-001:BASE_PLATE", name: "설치 베이스" },
      { partCode: "PUMP-001:COUPLING", name: "커플링" },
      { partCode: "PUMP-001:ELECTRIC_MOTOR", name: "전동 모터" },
      { partCode: "PUMP-001:IMPELLER", name: "임펠러" },
      { partCode: "PUMP-001:INLET_PIPE", name: "흡입 배관" },
      { partCode: "PUMP-001:OUTLET_PIPE", name: "토출 배관" },
      { partCode: "PUMP-001:PUMP_CASING", name: "펌프 케이싱" },
      { partCode: "PUMP-001:SHAFT", name: "회전축" },
    ],
  },
  {
    equipmentCode: "COMPRESSOR-001",
    name: "컴프레서",
    parts: [
      { partCode: "COMPRESSOR-001:AIR_PIPE", name: "공기 배관" },
      { partCode: "COMPRESSOR-001:AIR_TANK", name: "공기 저장 탱크" },
      { partCode: "COMPRESSOR-001:COMPRESSOR_HEAD", name: "압축기 헤드" },
      { partCode: "COMPRESSOR-001:CONTROL_BOX", name: "제어 박스" },
      { partCode: "COMPRESSOR-001:COOLING_FAN", name: "냉각 팬" },
      { partCode: "COMPRESSOR-001:MOTOR", name: "전동 모터" },
      { partCode: "COMPRESSOR-001:PRESSURE_GAUGE", name: "압력계" },
      { partCode: "COMPRESSOR-001:SAFETY_VALVE", name: "안전 밸브" },
    ],
  },
];

export function unityPartsFor(equipmentCode?: string) {
  return unityCatalog.find((item) => item.equipmentCode === equipmentCode)?.parts ?? [];
}
