export type CaptionStyle = "minimal" | "bold" | "podcast" | "mrbeast";
export type TitleAnimation = "fade-in" | "slide-up" | "typewriter";
export type CaptionPosition = "top" | "center" | "bottom";
export type Platform = "instagram" | "youtube" | "tiktok" | "linkedin";
export type ProgressBarPosition = "top" | "bottom" | "none";

export interface CaptionSettings {
  enabled: boolean;
  style: CaptionStyle;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  position: CaptionPosition;
  text: string;
}

export interface TitleSettings {
  text: string;
  animation: TitleAnimation;
  hookText: string;
  hookEnabled: boolean;
}

export interface VisualSettings {
  emojis: EmojiReaction[];
  progressBar: ProgressBarPosition;
  zoomEffects: ZoomEffect[];
  brollSuggestions: string[];
}

export interface EmojiReaction {
  id: string;
  emoji: string;
  timestamp: number;
  position: { x: number; y: number };
}

export interface ZoomEffect {
  id: string;
  startTime: number;
  endTime: number;
  zoomLevel: number;
}

export interface PlatformSettings {
  platform: Platform;
  aspectRatio: string;
  maxDuration: number;
  hashtags: string[];
}

export interface ClipEdits {
  captions: CaptionSettings;
  title: TitleSettings;
  visual: VisualSettings;
  platform: PlatformSettings;
}

export const platformSpecs: Record<Platform, { aspectRatio: string; maxDuration: number; name: string }> = {
  instagram: { aspectRatio: "9:16", maxDuration: 90, name: "Instagram Reels" },
  youtube: { aspectRatio: "9:16", maxDuration: 60, name: "YouTube Shorts" },
  tiktok: { aspectRatio: "9:16", maxDuration: 180, name: "TikTok" },
  linkedin: { aspectRatio: "1:1", maxDuration: 120, name: "LinkedIn" },
};

export const captionStylePresets: Record<CaptionStyle, { fontFamily: string; fontSize: number; textColor: string; backgroundColor: string; backgroundOpacity: number }> = {
  minimal: {
    fontFamily: "Inter",
    fontSize: 18,
    textColor: "#FFFFFF",
    backgroundColor: "#000000",
    backgroundOpacity: 0.5,
  },
  bold: {
    fontFamily: "Impact",
    fontSize: 24,
    textColor: "#FFFF00",
    backgroundColor: "#000000",
    backgroundOpacity: 0.8,
  },
  podcast: {
    fontFamily: "Georgia",
    fontSize: 20,
    textColor: "#FFFFFF",
    backgroundColor: "#1a1a2e",
    backgroundOpacity: 0.9,
  },
  mrbeast: {
    fontFamily: "Arial Black",
    fontSize: 28,
    textColor: "#FFFFFF",
    backgroundColor: "#FF0000",
    backgroundOpacity: 1,
  },
};

export const defaultClipEdits: ClipEdits = {
  captions: {
    enabled: false,
    style: "minimal",
    fontFamily: "Inter",
    fontSize: 18,
    textColor: "#FFFFFF",
    backgroundColor: "#000000",
    backgroundOpacity: 0.5,
    position: "bottom",
    text: "Your caption text here...",
  },
  title: {
    text: "",
    animation: "fade-in",
    hookText: "",
    hookEnabled: false,
  },
  visual: {
    emojis: [],
    progressBar: "none",
    zoomEffects: [],
    brollSuggestions: ["Product shot", "Reaction clip", "Behind the scenes"],
  },
  platform: {
    platform: "tiktok",
    aspectRatio: "9:16",
    maxDuration: 180,
    hashtags: [],
  },
};
