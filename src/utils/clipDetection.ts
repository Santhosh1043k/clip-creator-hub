import { Clip } from "@/types/clip";

const clipTitleSuggestions = [
  "The Big Reveal Moment",
  "Unexpected Plot Twist",
  "Viral-Worthy Reaction",
  "Key Insight Highlight",
  "Emotional Peak",
  "Hilarious Moment",
  "Expert Tip Segment",
  "Behind The Scenes",
  "Hot Take Alert",
  "Must-See Moment",
  "Game-Changing Advice",
  "Shocking Discovery",
];

export const generateMockClips = (videoDuration: number): Clip[] => {
  const numClips = Math.min(8, Math.max(5, Math.floor(videoDuration / 30)));
  const clips: Clip[] = [];
  const usedTitles = new Set<number>();
  
  // Generate evenly distributed clips with some randomness
  const segmentSize = videoDuration / (numClips + 1);
  
  for (let i = 0; i < numClips; i++) {
    // Calculate approximate position with randomness
    const basePosition = segmentSize * (i + 1);
    const randomOffset = (Math.random() - 0.5) * segmentSize * 0.6;
    const startTime = Math.max(0, Math.min(videoDuration - 60, basePosition + randomOffset));
    
    // Random duration between 15-60 seconds
    const duration = Math.random() * 45 + 15;
    const endTime = Math.min(videoDuration, startTime + duration);
    
    // Get unique title
    let titleIndex: number;
    do {
      titleIndex = Math.floor(Math.random() * clipTitleSuggestions.length);
    } while (usedTitles.has(titleIndex) && usedTitles.size < clipTitleSuggestions.length);
    usedTitles.add(titleIndex);
    
    // Calculate virality score based on duration and position
    // Clips in the middle tend to have higher engagement
    const positionScore = 1 - Math.abs((startTime / videoDuration) - 0.5) * 0.4;
    // Shorter clips tend to perform better on short-form
    const durationScore = 1 - ((endTime - startTime) / 60) * 0.3;
    const randomBoost = Math.random() * 0.2;
    const score = Math.round((positionScore + durationScore + randomBoost) * 50 + 25);
    
    clips.push({
      id: `clip-${i + 1}`,
      startTime,
      endTime,
      title: clipTitleSuggestions[titleIndex],
      score: Math.min(98, Math.max(45, score)),
      selected: score > 70, // Auto-select high-scoring clips
    });
  }
  
  // Sort by start time
  return clips.sort((a, b) => a.startTime - b.startTime);
};

export const formatTimestamp = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const formatDuration = (startTime: number, endTime: number): string => {
  const duration = endTime - startTime;
  const secs = Math.round(duration);
  if (secs >= 60) {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  }
  return `${secs} seconds`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-secondary";
  return "text-muted-foreground";
};

export const getScoreLabel = (score: number): string => {
  if (score >= 85) return "🔥 Hot";
  if (score >= 70) return "✨ Good";
  if (score >= 55) return "👍 Fair";
  return "📊 Low";
};
