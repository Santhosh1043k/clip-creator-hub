import { Clip } from "@/types/clip";
import { formatTimestamp, formatDuration, getScoreColor, getScoreLabel } from "@/utils/clipDetection";
import { motion } from "framer-motion";
import { Clock, Zap, Check, Play } from "lucide-react";

interface ClipCardProps {
  clip: Clip;
  onSelect: (id: string) => void;
  onPreview: (clip: Clip) => void;
}

const ClipCard = ({ clip, onSelect, onPreview }: ClipCardProps) => {
  const duration = formatDuration(clip.startTime, clip.endTime);
  const timeRange = `${formatTimestamp(clip.startTime)} - ${formatTimestamp(clip.endTime)}`;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`glass-card-hover rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        clip.selected ? "ring-2 ring-primary shadow-[0_0_20px_hsla(260,85%,60%,0.3)]" : ""
      }`}
      onClick={() => onSelect(clip.id)}
    >
      {/* Thumbnail placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 group">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-muted-foreground/30">
            {formatTimestamp(clip.startTime)}
          </div>
        </div>
        
        {/* Play button overlay */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onPreview(clip);
          }}
          className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-14 h-14 rounded-full glass-card flex items-center justify-center">
            <Play className="w-6 h-6 text-foreground ml-1" />
          </div>
        </motion.button>

        {/* Selection indicator */}
        <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          clip.selected 
            ? "bg-primary border-primary" 
            : "border-muted-foreground/50 bg-background/50"
        }`}>
          {clip.selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Check className="w-4 h-4 text-primary-foreground" />
            </motion.div>
          )}
        </div>

        {/* Score badge */}
        <div className="absolute top-3 left-3 glass-card rounded-full px-2 py-1 flex items-center gap-1">
          <Zap className={`w-3 h-3 ${getScoreColor(clip.score)}`} />
          <span className={`text-xs font-semibold ${getScoreColor(clip.score)}`}>
            {clip.score}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-1">{clip.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
          <span className="text-xs">{timeRange}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs">{getScoreLabel(clip.score)}</span>
          <div className="h-1.5 flex-1 ml-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${clip.score}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClipCard;
