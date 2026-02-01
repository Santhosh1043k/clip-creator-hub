import { useState, useRef, useEffect } from "react";
import { Clip } from "@/types/clip";
import { formatTimestamp } from "@/utils/clipDetection";
import { motion } from "framer-motion";
import { X, Play, Pause, Minus, Plus, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ClipPreviewModalProps {
  clip: Clip;
  videoUrl: string;
  onClose: () => void;
  onSave: (clip: Clip) => void;
}

const ClipPreviewModal = ({ clip, videoUrl, onClose, onSave }: ClipPreviewModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(clip.startTime);
  const [startTime, setStartTime] = useState(clip.startTime);
  const [endTime, setEndTime] = useState(clip.endTime);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Loop within clip range
      if (video.currentTime >= endTime) {
        video.currentTime = startTime;
        video.pause();
        setIsPlaying(false);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [startTime, endTime]);

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

  const adjustStartTime = (delta: number) => {
    const newStart = Math.max(0, Math.min(endTime - 5, startTime + delta));
    setStartTime(newStart);
    setHasChanges(true);
    if (videoRef.current && videoRef.current.currentTime < newStart) {
      videoRef.current.currentTime = newStart;
    }
  };

  const adjustEndTime = (delta: number) => {
    const newEnd = Math.max(startTime + 5, endTime + delta);
    setEndTime(newEnd);
    setHasChanges(true);
  };

  const resetTrim = () => {
    setStartTime(clip.startTime);
    setEndTime(clip.endTime);
    setHasChanges(false);
    if (videoRef.current) {
      videoRef.current.currentTime = clip.startTime;
    }
  };

  const handleSave = () => {
    onSave({
      ...clip,
      startTime,
      endTime,
    });
    onClose();
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const clipDuration = endTime - startTime;
  const progress = ((currentTime - startTime) / clipDuration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-semibold text-lg">{clip.title}</h2>
            <p className="text-sm text-muted-foreground">
              {formatTimestamp(startTime)} - {formatTimestamp(endTime)} ({Math.round(clipDuration)}s)
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Video */}
        <div className="relative aspect-video bg-background">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onClick={togglePlay}
          />
          
          {/* Play/Pause overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity bg-background/20"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-foreground" />
              ) : (
                <Play className="w-8 h-8 text-foreground ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Slider
              value={[currentTime]}
              min={startTime}
              max={endTime}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTimestamp(currentTime)}</span>
              <span>{formatTimestamp(endTime)}</span>
            </div>
          </div>
        </div>

        {/* Trim controls */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Start time control */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Start Time</span>
                <span className="text-sm text-muted-foreground">{formatTimestamp(startTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustStartTime(-5)}
                  className="flex-1"
                >
                  <Minus className="w-4 h-4 mr-1" /> 5s
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustStartTime(-1)}
                  className="flex-1"
                >
                  <Minus className="w-4 h-4 mr-1" /> 1s
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustStartTime(1)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" /> 1s
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustStartTime(5)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" /> 5s
                </Button>
              </div>
            </div>

            {/* End time control */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">End Time</span>
                <span className="text-sm text-muted-foreground">{formatTimestamp(endTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustEndTime(-5)}
                  className="flex-1"
                >
                  <Minus className="w-4 h-4 mr-1" /> 5s
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustEndTime(-1)}
                  className="flex-1"
                >
                  <Minus className="w-4 h-4 mr-1" /> 1s
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustEndTime(1)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" /> 1s
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustEndTime(5)}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" /> 5s
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              onClick={resetTrim}
              disabled={!hasChanges}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClipPreviewModal;
