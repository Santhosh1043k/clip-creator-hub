import { Clip } from "@/types/clip";
import ClipCard from "./ClipCard";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckSquare, Square } from "lucide-react";

interface ClipResultsGridProps {
  clips: Clip[];
  onSelectClip: (id: string) => void;
  onPreviewClip: (clip: Clip) => void;
  onFindMore: () => void;
}

const ClipResultsGrid = ({ 
  clips, 
  onSelectClip, 
  onPreviewClip, 
  onFindMore 
}: ClipResultsGridProps) => {
  const selectedCount = clips.filter(c => c.selected).length;

  const selectAll = () => {
    clips.forEach(clip => {
      if (!clip.selected) onSelectClip(clip.id);
    });
  };

  const deselectAll = () => {
    clips.forEach(clip => {
      if (clip.selected) onSelectClip(clip.id);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Detected Clips <span className="text-primary">({clips.length})</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedCount} clip{selectedCount !== 1 ? "s" : ""} selected for export
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={selectAll}>
            <CheckSquare className="w-4 h-4 mr-2" />
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={deselectAll}>
            <Square className="w-4 h-4 mr-2" />
            Deselect All
          </Button>
          <Button variant="outline" onClick={onFindMore}>
            <Sparkles className="w-4 h-4 mr-2" />
            Find More Clips
          </Button>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        layout
      >
        <AnimatePresence>
          {clips.map((clip, index) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ClipCard
                clip={clip}
                onSelect={onSelectClip}
                onPreview={onPreviewClip}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ClipResultsGrid;
