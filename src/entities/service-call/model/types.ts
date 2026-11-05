export type CallUrgency = "high" | "mid" | "low";
export type CallStatus = "new" | "assigned" | "done" | "self";

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
  // Mock: Unity part highlighted in the 3D view.
  unityPart: string;
};
