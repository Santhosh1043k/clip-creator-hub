export interface Clip {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  score: number;
  selected: boolean;
  thumbnail?: string;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "complete";
}

export type ProcessingStatus = "idle" | "processing" | "complete";
