export type RequestStatus = "received" | "progress" | "done";

export type PartHistoryItem = {
  id: string;
  kind: "fault" | "service";
  date: string;
  title: string;
  note?: string;
  by: string;
};

export type AsRequest = {
  id: string;
  equipment: string;
  part: string;
  company: string;
  date: string;
  status: RequestStatus;
  symptoms: string[];
  description: string;
  history: PartHistoryItem[];
  report?: string;
};
