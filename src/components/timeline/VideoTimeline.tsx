import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Play } from "lucide-react";
import { Clip } from "@/types/clip";
import { formatTimestamp } from "@/utils/clipUtils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoTimelineProps {
  duration: number;
  currentTime: number;
  clips: Clip[];
  onSeek: (time: number) => void;
  onClipCreate?: (startTime: number, endTime: number) => void;
}

const VideoTimeline = ({
  duration,
  currentTime,
  clips,
  onSeek,
  onClipCreate,
}: VideoTimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const getTimeFromPosition = useCallback(
    (clientX: number): number => {
      if (!timelineRef.current) return 0;
      const rect = timelineRef.current.getBoundingClientRect();
      const scrollLeft = timelineRef.current.scrollLeft;
      const x = clientX - rect.left + scrollLeft;
      const percentage = x / (rect.width * zoom);
      return Math.max(0, Math.min(duration, percentage * duration));
    },
    [duration, zoom]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      // Start selection
      setIsSelecting(true);
      const time = getTimeFromPosition(e.clientX);
      setSelectionStart(time);
      setSelectionEnd(time);
    } else {
      setIsDragging(true);
      const time = getTimeFromPosition(e.clientX);
      onSeek(time);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const time = getTimeFromPosition(e.clientX);
    setHoverTime(time);

    if (isDragging) {
      onSeek(time);
    } else if (isSelecting && selectionStart !== null) {
      setSelectionEnd(time);
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectionStart !== null && selectionEnd !== null) {
      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd);
      if (end - start > 5 && onClipCreate) {
        onClipCreate(start, end);
      }
    }
    setIsDragging(false);
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
    if (isDragging) {
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isSelecting, selectionStart, selectionEnd]);

  const zoomIn = () => setZoom((z) => Math.min(z * 1.5, 4));
  const zoomOut = () => setZoom((z) => Math.max(z / 1.5, 1));

  // Generate time markers
  const markerInterval = duration > 300 ? 60 : duration > 60 ? 30 : 10;
  const markers = [];
  for (let t = 0; t <= duration; t += markerInterval) {
    markers.push(t);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4"
    >
      {/* Timeline header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {zoom > 1 ? `${zoom.toFixed(1)}x zoom` : "1x"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={zoomOut}
            disabled={zoom <= 1}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={zoomIn}
            disabled={zoom >= 4}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground mb-3">
        Click to seek • Shift+drag to create custom clip
      </p>

      {/* Timeline container */}
      <div
        ref={timelineRef}
        className="relative h-24 overflow-x-auto cursor-crosshair select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative h-full"
          style={{ width: `${100 * zoom}%`, minWidth: "100%" }}
        >
          {/* Background track */}
          <div className="absolute top-8 left-0 right-0 h-12 bg-muted/50 rounded-lg" />

          {/* Time markers */}
          <div className="absolute top-0 left-0 right-0 h-6">
            {markers.map((time) => (
              <div
                key={time}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${(time / duration) * 100}%` }}
              >
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {formatTimestamp(time)}
                </span>
                <div className="w-px h-2 bg-muted-foreground/30" />
              </div>
            ))}
          </div>

          {/* Clip segments */}
          {clips.map((clip) => (
            <div
              key={clip.id}
              className={cn(
                "absolute top-8 h-12 rounded-md border-2 transition-colors",
                clip.selected
                  ? "bg-primary/30 border-primary"
                  : "bg-secondary/30 border-secondary/50"
              )}
              style={{
                left: `${(clip.startTime / duration) * 100}%`,
                width: `${((clip.endTime - clip.startTime) / duration) * 100}%`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] font-medium text-foreground truncate px-1">
                  {clip.title}
                </span>
              </div>
            </div>
          ))}

          {/* Selection overlay */}
          {isSelecting && selectionStart !== null && selectionEnd !== null && (
            <div
              className="absolute top-8 h-12 bg-accent/40 border-2 border-accent border-dashed rounded-md"
              style={{
                left: `${(Math.min(selectionStart, selectionEnd) / duration) * 100}%`,
                width: `${(Math.abs(selectionEnd - selectionStart) / duration) * 100}%`,
              }}
            />
          )}

          {/* Playhead */}
          <div
            className="absolute top-6 w-0.5 bg-primary z-10 transition-all"
            style={{
              left: `${(currentTime / duration) * 100}%`,
              height: "calc(100% - 24px)",
            }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
          </div>

          {/* Hover indicator */}
          {hoverTime !== null && !isDragging && (
            <div
              className="absolute top-6 w-px bg-foreground/30 pointer-events-none"
              style={{
                left: `${(hoverTime / duration) * 100}%`,
                height: "calc(100% - 24px)",
              }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-foreground text-background text-[10px] rounded whitespace-nowrap">
                {formatTimestamp(hoverTime)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current time display */}
      <div className="flex items-center justify-center mt-3 gap-2">
        <Play className="w-4 h-4 text-primary" />
        <span className="text-sm font-mono text-foreground">
          {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
        </span>
      </div>
    </motion.div>
  );
};

export default VideoTimeline;
