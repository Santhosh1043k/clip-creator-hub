import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Minus, Plus, Check, RotateCcw, Edit } from "lucide-react";
import { Clip } from "@/types/clip";
import { formatTimestamp } from "@/utils/clipUtils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  const navigate = useNavigate();
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

  const handleOpenEditor = () => {
    if (clip) {
      const params = new URLSearchParams({
        video: videoUrl,
        start: startTime.toString(),
        end: endTime.toString(),
        title: clip.title,
      });
      onClose();
      navigate(`/editor?${params.toString()}`);
    }
  };

  if (!clip) return null;

  const clipDuration = endTime - startTime;

  return (
    <Dialog open={!!clip} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl">
        <DialogHeader className="p-3 pb-0">
          <DialogTitle className="text-base">{clip.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Preview and adjust clip timing for {clip.title}
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 space-y-3 overflow-y-auto max-h-[calc(90vh-60px)]">
          {/* Video player - smaller aspect ratio */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden max-h-[35vh]">
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
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </div>
            </button>
          </div>

          {/* Timeline slider - more compact */}
          <div className="space-y-1">
            <div className="relative">
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
              <span className="font-medium">{formatTimestamp(startTime)} - {formatTimestamp(endTime)}</span>
              <span>{formatTimestamp(videoRef.current?.duration || 0)}</span>
            </div>
          </div>

          {/* Trim controls - more compact grid */}
          <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-border">
            {/* Start time */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Start</label>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => adjustStart(-5)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <div className="flex-1 text-center font-mono text-sm">
                  {formatTimestamp(startTime)}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => adjustStart(5)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* End time */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">End</label>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => adjustEnd(-5)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <div className="flex-1 text-center font-mono text-sm">
                  {formatTimestamp(endTime)}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => adjustEnd(5)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Duration info - inline */}
          <div className="text-center text-xs text-muted-foreground">
            Duration: <span className="font-semibold text-foreground">{Math.round(clipDuration)}s</span>
          </div>

          {/* Action buttons - more compact */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <Button variant="secondary" size="sm" onClick={handleOpenEditor} className="gap-1.5">
              <Edit className="w-3.5 h-3.5" />
              Open in Editor
            </Button>
            <div className="flex gap-2">
              {hasChanges && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reset
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="hero" size="sm" onClick={handleSave}>
                <Check className="w-3.5 h-3.5 mr-1" />
                {hasChanges ? "Save" : "OK"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClipPreviewModal;
