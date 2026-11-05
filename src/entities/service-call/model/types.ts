export type CallUrgency = "high" | "mid" | "low";
// "visited": the engineer's visit date has passed, so the repair record is due.
export type CallStatus = "new" | "assigned" | "visited" | "done" | "self";

export type Visit = {
  engineer: string;
  date: string;
};

export type SuspectPart = {
  code: string;
  name: string;
  note: string;
  state: "tried" | "next";
};

export type ServiceCall = {
  id: string;
  consultId?: string;
  equipmentId: string;
  urgency: CallUrgency;
  status: CallStatus;
  company: string;
  equipmentName: string;
  model: string;
  symptom: string;
  reason: string;
  reasonTag: string;
  time: string;
  summary: {
    symptom: string;
    checked: string;
    cause: string;
    tried: string;
  };
  nextCheck: string;
  suspectParts: SuspectPart[];
  visit?: Visit;
  // Mock: Unity part highlighted in the 3D view.
  unityPart: string;
};
