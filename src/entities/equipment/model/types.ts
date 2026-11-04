export type EquipmentStatus = "normal" | "fault" | "progress";

export type HistoryItem = {
  id: string;
  kind: "fault" | "service";
  date: string;
  title: string;
  part?: string;
  note?: string;
  by: string;
};

export type Equipment = {
  id: string;
  name: string;
  model: string;
  site: string;
  serial: string;
  maker: string;
  installedAt: string;
  lastService: string;
  status: EquipmentStatus;
  history: HistoryItem[];
};
