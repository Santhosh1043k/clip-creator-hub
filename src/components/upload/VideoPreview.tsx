import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Clock, HardDrive, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

interface VideoMetadata {
  duration: string;
  size: string;
  format: string;
}

interface VideoPreviewProps {
  file: File;
  onVideoLoaded?: (duration: number, videoRef: HTMLVideoElement) => void;
  onTimeUpdate?: (time: number) => void;
}

const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileFormat = (type: string): string => {
  const formats: Record<string, string> = {
    "video/mp4": "MP4",
    "video/quicktime": "MOV",
    "video/x-msvideo": "AVI",
  };
  return formats[type] || "Unknown";
};

const VideoPreview = ({ file, onVideoLoaded, onTimeUpdate }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    setMetadata({
      duration: "Loading...",
      size: formatFileSize(file.size),
      format: getFileFormat(file.type),
    });

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setMetadata(prev => prev ? { ...prev, duration: formatDuration(dur) } : null);
      onVideoLoaded?.(dur, videoRef.current);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate?.(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Video Player */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
          
          {/* Play/Pause overlay */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-foreground" />
              ) : (
                <Play className="w-8 h-8 text-foreground ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-3">
          {/* Progress bar */}
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metadata Cards */}
      {metadata && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mt-6"
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-semibold">{metadata.duration}</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <HardDrive className="w-5 h-5 mx-auto mb-2 text-secondary" />
            <p className="text-sm text-muted-foreground">Size</p>
            <p className="font-semibold">{metadata.size}</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <Film className="w-5 h-5 mx-auto mb-2 text-accent" />
            <p className="text-sm text-muted-foreground">Format</p>
            <p className="font-semibold">{metadata.format}</p>
          </div>
        </motion.div>
      )}

      {/* File name */}
      <p className="text-center text-muted-foreground text-sm mt-4 truncate px-4">
        {file.name}
      </p>
    </motion.div>
  );
};

export default VideoPreview;
