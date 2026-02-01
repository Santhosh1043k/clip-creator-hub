import { Clip } from "@/types/clip";

export const formatTimestamp = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatDuration = (startTime: number, endTime: number): string => {
  const duration = Math.round(endTime - startTime);
  if (duration < 60) {
    return `${duration} seconds`;
  }
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} minute${mins > 1 ? "s" : ""}`;
};

const clipTitleTemplates = [
  "Epic Moment",
  "Viral Hook",
  "Key Insight",
  "Emotional Peak",
  "Trending Clip",
  "Must-See Moment",
  "Highlight Reel",
  "Engagement Gold",
  "Scroll Stopper",
  "Share-Worthy",
];

export const generateClips = (videoDuration: number, count: number = 6): Clip[] => {
  const clips: Clip[] = [];
  const minClipDuration = 15;
  const maxClipDuration = 60;
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    const clipDuration = Math.random() * (maxClipDuration - minClipDuration) + minClipDuration;
    const maxStart = Math.max(0, videoDuration - clipDuration - 10);
    const startTime = Math.random() * maxStart;
    const endTime = Math.min(startTime + clipDuration, videoDuration);

    // Generate unique title
    let title: string;
    do {
      title = clipTitleTemplates[Math.floor(Math.random() * clipTitleTemplates.length)];
    } while (usedTitles.has(title) && usedTitles.size < clipTitleTemplates.length);
    usedTitles.add(title);

    // Calculate virality score based on position and duration
    const positionFactor = 1 - Math.abs(startTime / videoDuration - 0.3); // Prefer clips around 30%
    const durationFactor = clipDuration >= 30 && clipDuration <= 45 ? 1 : 0.8; // Optimal duration
    const randomFactor = 0.7 + Math.random() * 0.3;
    const score = Math.round(positionFactor * durationFactor * randomFactor * 100);

    clips.push({
      id: `clip-${i + 1}`,
      startTime,
      endTime,
      title: `${title} #${i + 1}`,
      score: Math.min(99, Math.max(45, score)),
      selected: score > 70, // Pre-select high-scoring clips
    });
  }

  // Sort by start time
  return clips.sort((a, b) => a.startTime - b.startTime);
};

export const extractThumbnail = (
  video: HTMLVideoElement,
  time: number
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const onSeeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);
      const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
      video.removeEventListener("seeked", onSeeked);
      resolve(thumbnail);
    };

    video.addEventListener("seeked", onSeeked);
    video.currentTime = time;
  });
};
