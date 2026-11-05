export type RepairLevel = "user" | "engineer";

export type RepairRecord = {
  id: string;
  equipmentId: string;
  model: string;
  system: string;
  date: string;
  partCode: string;
  partName: string;
  cause: string;
  fix: string;
  note: string;
  level: RepairLevel;
};
