export type SolutionDraft = {
  id: string;
  model: string;
  date: string;
  title: string;
  steps: string[];
  sources: { id: string; summary: string }[];
  approved: boolean;
};
