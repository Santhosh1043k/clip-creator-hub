import { useState, useRef, useCallback, useEffect } from "react";
import { Clip } from "@/types/clip";
import { formatTimestamp } from "@/utils/clipDetection";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface VideoTimelineProps {
  duration: number;
  currentTime: number;
  clips: Clip[];
  onSeek: (time: number) => void;
  onClipClick: (clip: Clip) => void;
  onAddCustomClip: (startTime: number, endTime: number) => void;
}

const VideoTimeline = ({
  duration,
  currentTime,
  clips,
  onSeek,
  onClipClick,
  onAddCustomClip,
}: VideoTimelineProps) => {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const getTimeFromPosition = useCallback((clientX: number): number => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = timelineRef.current.scrollLeft;
    const relativeX = clientX - rect.left + scrollLeft;
    const totalWidth = rect.width * zoom;
    return Math.max(0, Math.min(duration, (relativeX / totalWidth) * duration));
  }, [duration, zoom]);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const time = getTimeFromPosition(e.clientX);
    onSeek(time);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      setIsDragging(true);
      const time = getTimeFromPosition(e.clientX);
      setDragStart(time);
      setDragEnd(time);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStart !== null) {
      const time = getTimeFromPosition(e.clientX);
      setDragEnd(time);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart !== null && dragEnd !== null) {
      const start = Math.min(dragStart, dragEnd);
      const end = Math.max(dragStart, dragEnd);
      if (end - start >= 5) { // Minimum 5 seconds
        onAddCustomClip(start, end);
      }
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, dragStart, dragEnd]);

  // Generate time markers
  const timeMarkers = [];
  const markerInterval = duration > 300 ? 60 : duration > 60 ? 15 : 5;
  for (let i = 0; i <= duration; i += markerInterval) {
    timeMarkers.push(i);
  }

  const playheadPosition = (currentTime / duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4"
    >
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Timeline</span>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md">
            Shift + Drag to select custom range
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(z => Math.max(1, z - 0.5))}
            disabled={zoom <= 1}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm w-12 text-center">{zoom.toFixed(1)}x</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(z => Math.min(4, z + 0.5))}
            disabled={zoom >= 4}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={timelineRef}
        className="relative h-32 overflow-x-auto cursor-pointer select-none"
        onClick={handleTimelineClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          className="relative h-full min-w-full"
          style={{ width: `${100 * zoom}%` }}
        >
          {/* Time markers */}
          <div className="absolute top-0 left-0 right-0 h-6 flex">
            {timeMarkers.map((time) => (
              <div
                key={time}
                className="absolute text-xs text-muted-foreground"
                style={{ left: `${(time / duration) * 100}%` }}
              >
                <div className="w-px h-2 bg-muted-foreground/30" />
                <span className="ml-1">{formatTimestamp(time)}</span>
              </div>
            ))}
          </div>

          {/* Track background */}
          <div className="absolute top-8 left-0 right-0 h-16 rounded-lg bg-muted/50">
            {/* Waveform visualization (simplified) */}
            <div className="absolute inset-0 flex items-center justify-around px-1">
              {Array.from({ length: Math.floor(duration / 2) }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-muted-foreground/20 rounded-full"
                  style={{ height: `${20 + Math.random() * 60}%` }}
                />
              ))}
            </div>
          </div>

          {/* Clip segments */}
          {clips.map((clip) => (
            <Tooltip key={clip.id}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  className={`absolute top-8 h-16 rounded-lg cursor-pointer transition-all duration-200 ${
                    clip.selected
                      ? "bg-primary/40 border-2 border-primary hover:bg-primary/50"
                      : "bg-secondary/30 border border-secondary/50 hover:bg-secondary/40"
                  }`}
                  style={{
                    left: `${(clip.startTime / duration) * 100}%`,
                    width: `${((clip.endTime - clip.startTime) / duration) * 100}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClipClick(clip);
                  }}
                  whileHover={{ y: -2 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-2">
                    <span className="text-xs font-medium truncate text-foreground/70">
                      {clip.title}
                    </span>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{clip.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(clip.startTime)} - {formatTimestamp(clip.endTime)}
                </p>
                <p className="text-xs">Score: {clip.score}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Custom selection overlay */}
          {isDragging && dragStart !== null && dragEnd !== null && (
            <div
              className="absolute top-8 h-16 bg-accent/30 border-2 border-accent border-dashed rounded-lg pointer-events-none"
              style={{
                left: `${(Math.min(dragStart, dragEnd) / duration) * 100}%`,
                width: `${(Math.abs(dragEnd - dragStart) / duration) * 100}%`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Plus className="w-5 h-5 text-accent" />
              </div>
            </div>
          )}

          {/* Playhead */}
          <motion.div
            className="absolute top-6 w-0.5 bg-foreground z-10"
            style={{ 
              left: `${playheadPosition}%`,
              height: "calc(100% - 1.5rem)"
            }}
            animate={{ left: `${playheadPosition}%` }}
            transition={{ duration: 0.1 }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 rounded-full bg-foreground" />
          </motion.div>

          {/* Current time display */}
          <div 
            className="absolute bottom-0 transform -translate-x-1/2 text-xs glass-card px-2 py-1 rounded"
            style={{ left: `${playheadPosition}%` }}
          >
            {formatTimestamp(currentTime)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoTimeline;
