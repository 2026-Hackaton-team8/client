export type ManualEntry = {
  problem: string;
  solution: string;
};

export type ModelManual = {
  id: string;
  model: string;
  title: string;
  entries: ManualEntry[];
  createdAt: string;
};
