import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Minus, Plus, Check, RotateCcw } from "lucide-react";
import { Clip } from "@/types/clip";
import { formatTimestamp } from "@/utils/clipUtils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClipPreviewModalProps {
  clip: Clip | null;
  videoUrl: string;
  onClose: () => void;
  onSave: (clip: Clip) => void;
}

const ClipPreviewModal = ({
  clip,
  videoUrl,
  onClose,
  onSave,
}: ClipPreviewModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (clip) {
      setStartTime(clip.startTime);
      setEndTime(clip.endTime);
      setCurrentTime(clip.startTime);
      setHasChanges(false);
    }
  }, [clip]);

  useEffect(() => {
    if (videoRef.current && clip) {
      videoRef.current.currentTime = startTime;
    }
  }, [clip, startTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Loop within clip bounds
      if (time >= endTime) {
        videoRef.current.currentTime = startTime;
        setCurrentTime(startTime);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (videoRef.current.currentTime < startTime || videoRef.current.currentTime >= endTime) {
          videoRef.current.currentTime = startTime;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const adjustStart = (delta: number) => {
    const newStart = Math.max(0, startTime + delta);
    if (newStart < endTime - 5) {
      setStartTime(newStart);
      setHasChanges(true);
      if (videoRef.current) {
        videoRef.current.currentTime = newStart;
      }
    }
  };

  const adjustEnd = (delta: number) => {
    if (videoRef.current) {
      const maxEnd = videoRef.current.duration;
      const newEnd = Math.min(maxEnd, endTime + delta);
      if (newEnd > startTime + 5) {
        setEndTime(newEnd);
        setHasChanges(true);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleReset = () => {
    if (clip) {
      setStartTime(clip.startTime);
      setEndTime(clip.endTime);
      setHasChanges(false);
      if (videoRef.current) {
        videoRef.current.currentTime = clip.startTime;
      }
    }
  };

  const handleSave = () => {
    if (clip) {
      onSave({
        ...clip,
        startTime,
        endTime,
      });
    }
  };

  if (!clip) return null;

  const clipDuration = endTime - startTime;

  return (
    <Dialog open={!!clip} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-lg">{clip.title}</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Video player */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Play overlay */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </div>
            </button>
          </div>

          {/* Timeline slider */}
          <div className="space-y-2">
            <div className="relative">
              {/* Clip range visualization */}
              <div className="absolute top-0 h-2 rounded-full bg-primary/30"
                style={{
                  left: `${(startTime / (videoRef.current?.duration || 1)) * 100}%`,
                  width: `${(clipDuration / (videoRef.current?.duration || 1)) * 100}%`,
                }}
              />
              <Slider
                value={[currentTime]}
                min={0}
                max={videoRef.current?.duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTimestamp(currentTime)}</span>
              <span>Clip: {formatTimestamp(startTime)} - {formatTimestamp(endTime)}</span>
              <span>{formatTimestamp(videoRef.current?.duration || 0)}</span>
            </div>
          </div>

          {/* Trim controls */}
          <div className="grid grid-cols-2 gap-6 py-4 border-t border-b border-border">
            {/* Start time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Time</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => adjustStart(-5)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center font-mono text-lg">
                  {formatTimestamp(startTime)}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => adjustStart(5)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">±5 seconds</p>
            </div>

            {/* End time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">End Time</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => adjustEnd(-5)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center font-mono text-lg">
                  {formatTimestamp(endTime)}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => adjustEnd(5)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">±5 seconds</p>
            </div>
          </div>

          {/* Duration info */}
          <div className="text-center text-sm text-muted-foreground">
            Clip duration: <span className="font-semibold text-foreground">{Math.round(clipDuration)} seconds</span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            {hasChanges && (
              <Button variant="ghost" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSave}>
              <Check className="w-4 h-4 mr-2" />
              {hasChanges ? "Save Changes" : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClipPreviewModal;
