export type ConsultStatus = "calling" | "progress" | "resolved";

export type ChatMessage = {
  id: string;
  from: "ai" | "user";
  text: string;
};

export type CauseCandidate = {
  name: string;
  ruledOut: boolean;
};

export type Consultation = {
  id: string;
  equipmentId: string;
  symptom: string;
  summary: string;
  cause: string;
  tried: string;
  status: ConsultStatus;
  dateLabel: string;
  questions: number;
  maxQuestions: number;
  candidates: CauseCandidate[];
  messages: ChatMessage[];
  solution: {
    title: string;
    steps: string[];
    source: string;
  };
  suspect: {
    code: string;
    name: string;
    location: string;
    // Mock: Unity part highlighted for this suspect.
    unityPart: string;
  };
};
