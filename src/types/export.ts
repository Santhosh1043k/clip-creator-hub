export type ExportQuality = "high" | "medium" | "low";
export type ExportFormat = "mp4" | "mov";
export type CaptionOption = "burned-in" | "srt" | "none";
export type ExportStatus = "queued" | "processing" | "complete" | "failed";

export interface ExportConfig {
  quality: ExportQuality;
  format: ExportFormat;
  captionOption: CaptionOption;
  platform: string | null;
}

export interface ExportJob {
  id: string;
  clipId: string;
  clipTitle: string;
  thumbnail?: string;
  status: ExportStatus;
  progress: number;
  estimatedTimeRemaining: number;
  config: ExportConfig;
  createdAt: Date;
  completedAt?: Date;
  fileSize?: string;
  downloadUrl?: string;
  error?: string;
}

export interface ExportedClip {
  id: string;
  title: string;
  thumbnail?: string;
  platform: string;
  platformBadges: string[];
  fileSize: string;
  exportDate: Date;
  downloadUrl: string;
  shareLink: string;
  hashtags: string[];
}

export const QUALITY_OPTIONS = {
  high: { label: "High (1080p)", resolution: "1080p", bitrate: "8Mbps" },
  medium: { label: "Medium (720p)", resolution: "720p", bitrate: "5Mbps" },
  low: { label: "Low (480p)", resolution: "480p", bitrate: "2.5Mbps" },
} as const;

export const FORMAT_OPTIONS = {
  mp4: { label: "MP4", extension: ".mp4", mime: "video/mp4" },
  mov: { label: "MOV", extension: ".mov", mime: "video/quicktime" },
} as const;

export const PLATFORM_PRESETS = {
  tiktok: {
    quality: "high" as ExportQuality,
    format: "mp4" as ExportFormat,
    aspectRatio: "9:16",
    maxDuration: 180,
  },
  instagram: {
    quality: "high" as ExportQuality,
    format: "mp4" as ExportFormat,
    aspectRatio: "9:16",
    maxDuration: 90,
  },
  youtube: {
    quality: "high" as ExportQuality,
    format: "mp4" as ExportFormat,
    aspectRatio: "9:16",
    maxDuration: 60,
  },
  linkedin: {
    quality: "medium" as ExportQuality,
    format: "mp4" as ExportFormat,
    aspectRatio: "1:1",
    maxDuration: 120,
  },
} as const;
