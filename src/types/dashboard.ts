export interface Project {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  uploadDate: Date;
  clipCount: number;
  duration: number; // in seconds
  status: "processing" | "ready" | "failed";
}

export interface UserStats {
  totalVideosProcessed: number;
  clipsCreated: number;
  hoursSaved: number;
  weeklyActivity: { day: string; clips: number }[];
}

export interface UserSettings {
  defaultQuality: "high" | "medium" | "low";
  defaultFormat: "mp4" | "mov";
  favoriteCaptionStyles: string[];
  platformPreferences: string[];
  notifications: {
    exportComplete: boolean;
    weeklyReport: boolean;
    tips: boolean;
  };
}

export const defaultUserSettings: UserSettings = {
  defaultQuality: "high",
  defaultFormat: "mp4",
  favoriteCaptionStyles: ["bold"],
  platformPreferences: ["tiktok", "instagram"],
  notifications: {
    exportComplete: true,
    weeklyReport: true,
    tips: true,
  },
};
