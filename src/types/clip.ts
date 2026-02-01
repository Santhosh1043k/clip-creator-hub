export interface Clip {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  score: number;
  thumbnail?: string;
  selected: boolean;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "complete";
}

export type AppStage = "upload" | "processing" | "results";
