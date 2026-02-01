import { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ClipEdits, CaptionPosition } from "@/types/clipEditor";
import { formatTime } from "@/utils/clipUtils";
import { useVideoKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorVideoPreviewProps {
  videoUrl: string;
  startTime: number;
  endTime: number;
  edits: ClipEdits;
  onTimeUpdate?: (time: number) => void;
}

const EditorVideoPreview = ({
  videoUrl,
  startTime,
  endTime,
  edits,
  onTimeUpdate,
}: EditorVideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [isMuted, setIsMuted] = useState(false);

  // Keyboard shortcuts
  useVideoKeyboardShortcuts(videoRef, {
    onPlayPause: () => setIsPlaying(videoRef.current ? !videoRef.current.paused : false),
  });

  const clipDuration = endTime - startTime;
  const relativeTime = currentTime - startTime;
  const progress = clipDuration > 0 ? (relativeTime / clipDuration) * 100 : 0;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);

      if (time >= endTime) {
        video.currentTime = startTime;
        if (isPlaying) {
          video.play();
        }
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [startTime, endTime, isPlaying, onTimeUpdate]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (videoRef.current.currentTime >= endTime || videoRef.current.currentTime < startTime) {
          videoRef.current.currentTime = startTime;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(startTime, Math.min(endTime, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = startTime + (value[0] / 100) * clipDuration;
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getPositionClass = (position: CaptionPosition) => {
    switch (position) {
      case "top": return "top-8";
      case "center": return "top-1/2 -translate-y-1/2";
      case "bottom": return "bottom-20";
    }
  };

  const showHook = edits.title.hookEnabled && relativeTime <= 3;

  return (
    <div className="flex flex-col h-full">
      {/* Video Container with Overlays */}
      <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          muted={isMuted}
        />

        {/* Progress Bar Overlay */}
        {edits.visual.progressBar !== "none" && (
          <div
            className={`absolute left-0 right-0 h-1 ${
              edits.visual.progressBar === "top" ? "top-0" : "bottom-0"
            }`}
          >
            <div className="h-full bg-white/30">
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Hook Text Overlay */}
        {showHook && edits.title.hookText && (
          <div className="absolute top-4 left-0 right-0 text-center animate-fade-in">
            <span className="px-4 py-2 bg-primary/90 text-primary-foreground text-lg font-bold rounded-lg">
              {edits.title.hookText}
            </span>
          </div>
        )}

        {/* Title Overlay */}
        {edits.title.text && !showHook && relativeTime > 0 && relativeTime < 5 && (
          <div className={`absolute top-4 left-0 right-0 text-center ${
            edits.title.animation === "fade-in" ? "animate-fade-in" :
            edits.title.animation === "slide-up" ? "animate-fade-in" :
            "animate-fade-in"
          }`}>
            <span className="px-4 py-2 bg-background/90 text-foreground text-xl font-bold rounded-lg">
              {edits.title.text}
            </span>
          </div>
        )}

        {/* Caption Overlay */}
        {edits.captions.enabled && (
          <div
            className={`absolute left-4 right-4 text-center ${getPositionClass(edits.captions.position)}`}
          >
            <span
              className="inline-block px-4 py-2 rounded-lg max-w-full"
              style={{
                fontFamily: edits.captions.fontFamily,
                fontSize: `${edits.captions.fontSize}px`,
                color: edits.captions.textColor,
                backgroundColor: `${edits.captions.backgroundColor}${Math.round(edits.captions.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
              }}
            >
              {edits.captions.text}
            </span>
          </div>
        )}

        {/* Emoji Reactions */}
        {edits.visual.emojis.map((emoji) => {
          const isVisible = relativeTime >= emoji.timestamp && relativeTime < emoji.timestamp + 2;
          if (!isVisible) return null;
          return (
            <div
              key={emoji.id}
              className="absolute text-4xl animate-scale-in"
              style={{
                left: `${emoji.position.x}%`,
                top: `${emoji.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {emoji.emoji}
            </div>
          );
        })}

        {/* Timestamp Badge */}
        <div className="absolute bottom-4 left-4 glass-card px-3 py-1 text-sm font-mono">
          {formatTime(relativeTime)} / {formatTime(clipDuration)}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 glass-card mt-4 rounded-lg space-y-4">
        {/* Progress Slider */}
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="cursor-pointer"
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => skip(-5)}>
                <SkipBack className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Skip back 5s (←)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="icon" className="h-12 w-12" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Play/Pause (Space)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => skip(5)}>
                <SkipForward className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Skip forward 5s (→)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleMute} className="ml-4">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mute (M)</TooltipContent>
          </Tooltip>
        </div>
        
        {/* Keyboard shortcuts hint */}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Keyboard className="w-3 h-3" />
          <span>Space: Play • ←→: Skip • M: Mute • F: Fullscreen</span>
        </div>
      </div>
    </div>
  );
};

export default EditorVideoPreview;
