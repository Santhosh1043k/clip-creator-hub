import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Download } from "lucide-react";
import { Clip } from "@/types/clip";
import { Button } from "@/components/ui/button";
import ClipCard from "./ClipCard";

interface ClipResultsProps {
  clips: Clip[];
  onSelectClip: (id: string) => void;
  onPreviewClip: (clip: Clip) => void;
  onFindMore: () => void;
}

const ClipResults = ({
  clips,
  onSelectClip,
  onPreviewClip,
  onFindMore,
}: ClipResultsProps) => {
  const selectedCount = clips.filter((c) => c.selected).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Suggested Clips
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {clips.length} clips found • {selectedCount} selected
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={onFindMore}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Find More
          </Button>
          <Button variant="hero" size="sm" disabled={selectedCount === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export ({selectedCount})
          </Button>
        </div>
      </div>

      {/* Clips grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip, index) => (
          <ClipCard
            key={clip.id}
            clip={clip}
            index={index}
            onSelect={onSelectClip}
            onPreview={onPreviewClip}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ClipResults;
