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
  parts: ModelPart[];
};
