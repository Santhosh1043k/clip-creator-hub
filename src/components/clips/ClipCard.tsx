import { motion } from "framer-motion";
import { Clock, Flame, Check } from "lucide-react";
import { Clip } from "@/types/clip";
import { formatTimestamp, formatDuration } from "@/utils/clipUtils";
import { cn } from "@/lib/utils";

interface ClipCardProps {
  clip: Clip;
  index: number;
  onSelect: (id: string) => void;
  onPreview: (clip: Clip) => void;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-orange-400";
};

const getScoreBg = (score: number): string => {
  if (score >= 80) return "bg-green-500/20 border-green-500/30";
  if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
  return "bg-orange-500/20 border-orange-500/30";
};

const ClipCard = ({ clip, index, onSelect, onPreview }: ClipCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "glass-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group",
        clip.selected
          ? "ring-2 ring-primary shadow-[0_0_20px_hsla(260,85%,60%,0.3)]"
          : "hover:ring-1 hover:ring-primary/50"
      )}
      onClick={() => onPreview(clip)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50">
        {clip.thumbnail ? (
          <img
            src={clip.thumbnail}
            alt={clip.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {index + 1}
              </span>
            </div>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-medium text-white">
          {formatDuration(clip.startTime, clip.endTime)}
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1" />
          </div>
        </div>

        {/* Selection checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(clip.id);
          }}
          className={cn(
            "absolute top-2 left-2 w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center",
            clip.selected
              ? "bg-primary border-primary"
              : "bg-black/50 border-white/50 hover:border-white"
          )}
        >
          {clip.selected && <Check className="w-4 h-4 text-primary-foreground" />}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
          {clip.title}
        </h3>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {formatTimestamp(clip.startTime)} - {formatTimestamp(clip.endTime)}
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full border",
              getScoreBg(clip.score)
            )}
          >
            <Flame className={cn("w-3.5 h-3.5", getScoreColor(clip.score))} />
            <span className={cn("text-xs font-semibold", getScoreColor(clip.score))}>
              {clip.score}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClipCard;
