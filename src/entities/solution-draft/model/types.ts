export type DraftStatus = "pending" | "approved";

export type SolutionDraft = {
  id: string;
  model: string;
  title: string;
  system: string;
  symptoms: string[];
  steps: string[];
  fallback: string;
  evidence: string[];
  status: DraftStatus;
  createdAt: string;
};
