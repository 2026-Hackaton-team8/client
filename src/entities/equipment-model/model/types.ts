export type ModelPart = {
  code: string;
  name: string;
};

export type EquipmentModel = {
  code: string;
  name: string;
  category: string;
  maker: string;
  installs: number;
  repairs: number;
  approvedSolutions: number;
  pendingDrafts: number;
  lastRepair: string;
  partCount: number;
  // Index passed to Unity SelectModelByIndex (build ships 0–6).
  unityIndex: number;
  parts: ModelPart[];
};
