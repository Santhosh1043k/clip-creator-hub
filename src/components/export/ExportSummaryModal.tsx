import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, Download, Share2, Copy, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExportedClip } from "@/types/export";
import { toast } from "sonner";

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportedClips: ExportedClip[];
  onCreateMore: () => void;
}

const ExportSummaryModal = ({
  isOpen,
  onClose,
  exportedClips,
  onCreateMore,
}: ExportSummaryModalProps) => {
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  // Fire confetti on open
  useEffect(() => {
    if (isOpen && exportedClips.length > 0) {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#a855f7", "#6366f1", "#ec4899"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#a855f7", "#6366f1", "#ec4899"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen, exportedClips.length]);

  // Get all unique hashtags
  const allHashtags = [...new Set(exportedClips.flatMap((c) => c.hashtags))];

  const copyHashtags = () => {
    navigator.clipboard.writeText(allHashtags.join(" "));
    setCopiedHashtags(true);
    toast.success("Hashtags copied!");
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleShare = (platform: string, clip: ExportedClip) => {
    // Simulate share - in real app would open native share dialogs
    toast.success(`Opening ${platform} to share "${clip.title}"...`);
  };

  const handleDownload = (clip: ExportedClip) => {
    // Simulate download
    toast.success(`Downloading "${clip.title}"...`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mx-auto mb-3"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <DialogTitle className="text-xl">
            <span className="gradient-text">Export Complete!</span>
          </DialogTitle>
          <DialogDescription>
            {exportedClips.length} clip{exportedClips.length !== 1 ? "s" : ""} ready to share
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2">
          {/* Exported Clips */}
          {exportedClips.map((clip, index) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg border border-border bg-muted/30 space-y-3"
            >
              <div className="flex items-start gap-3">
                {clip.thumbnail ? (
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    className="w-16 h-10 rounded object-cover"
                  />
                ) : (
                  <div className="w-16 h-10 rounded bg-muted flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{clip.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {clip.platformBadges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {clip.fileSize}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(clip)}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("TikTok", clip)}
                >
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}

          {/* Hashtag Suggestions */}
          {allHashtags.length > 0 && (
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Suggested Hashtags</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyHashtags}
                  className="h-7"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  {copiedHashtags ? "Copied!" : "Copy All"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allHashtags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            View Downloads
          </Button>
          <Button variant="hero" onClick={onCreateMore} className="flex-1">
            Create More Clips
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportSummaryModal;
