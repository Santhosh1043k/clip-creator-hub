import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ExportConfig,
  ExportQuality,
  ExportFormat,
  CaptionOption,
  QUALITY_OPTIONS,
  FORMAT_OPTIONS,
  PLATFORM_PRESETS,
} from "@/types/export";
import { Clip } from "@/types/clip";

interface ExportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  clips: Clip[];
  selectedClipIds: string[];
  onExport: (clipIds: string[], config: ExportConfig) => void;
}

const ExportConfigModal = ({
  isOpen,
  onClose,
  clips,
  selectedClipIds,
  onExport,
}: ExportConfigModalProps) => {
  const [config, setConfig] = useState<ExportConfig>({
    quality: "high",
    format: "mp4",
    captionOption: "burned-in",
    platform: null,
  });
  const [selectedForExport, setSelectedForExport] = useState<string[]>(selectedClipIds);

  const handlePlatformPreset = (platform: keyof typeof PLATFORM_PRESETS) => {
    const preset = PLATFORM_PRESETS[platform];
    setConfig({
      ...config,
      quality: preset.quality,
      format: preset.format,
      platform,
    });
  };

  const toggleClipSelection = (clipId: string) => {
    setSelectedForExport((prev) =>
      prev.includes(clipId)
        ? prev.filter((id) => id !== clipId)
        : [...prev, clipId]
    );
  };

  const handleExport = () => {
    if (selectedForExport.length === 0) return;
    onExport(selectedForExport, config);
  };

  const selectedClips = clips.filter((c) => selectedForExport.includes(c.id));

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Export Configuration
          </DialogTitle>
          <DialogDescription>
            Configure export settings for {selectedForExport.length} clip{selectedForExport.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 overflow-y-auto max-h-[60vh] pr-2">
          {/* Platform Quick Presets */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Platform Presets</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PLATFORM_PRESETS) as Array<keyof typeof PLATFORM_PRESETS>).map(
                (platform) => (
                  <Button
                    key={platform}
                    variant={config.platform === platform ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePlatformPreset(platform)}
                    className="capitalize"
                  >
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    {platform}
                  </Button>
                )
              )}
            </div>
            {config.platform && (
              <p className="text-xs text-muted-foreground">
                Auto-configured for {config.platform}: {PLATFORM_PRESETS[config.platform as keyof typeof PLATFORM_PRESETS].aspectRatio}, max {PLATFORM_PRESETS[config.platform as keyof typeof PLATFORM_PRESETS].maxDuration}s
              </p>
            )}
          </div>

          {/* Quality Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quality</Label>
            <RadioGroup
              value={config.quality}
              onValueChange={(value) =>
                setConfig({ ...config, quality: value as ExportQuality })
              }
              className="flex gap-4"
            >
              {(Object.entries(QUALITY_OPTIONS) as [ExportQuality, typeof QUALITY_OPTIONS.high][]).map(
                ([key, option]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`quality-${key}`} />
                    <Label htmlFor={`quality-${key}`} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Format</Label>
            <RadioGroup
              value={config.format}
              onValueChange={(value) =>
                setConfig({ ...config, format: value as ExportFormat })
              }
              className="flex gap-4"
            >
              {(Object.entries(FORMAT_OPTIONS) as [ExportFormat, typeof FORMAT_OPTIONS.mp4][]).map(
                ([key, option]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`format-${key}`} />
                    <Label htmlFor={`format-${key}`} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </div>

          {/* Caption Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Captions</Label>
            <RadioGroup
              value={config.captionOption}
              onValueChange={(value) =>
                setConfig({ ...config, captionOption: value as CaptionOption })
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="burned-in" id="caption-burned" />
                <Label htmlFor="caption-burned" className="text-sm cursor-pointer">
                  Burned-in (embedded in video)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="srt" id="caption-srt" />
                <Label htmlFor="caption-srt" className="text-sm cursor-pointer">
                  Separate SRT file
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="caption-none" />
                <Label htmlFor="caption-none" className="text-sm cursor-pointer">
                  No captions
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Batch Selection */}
          {clips.length > 1 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Clips to Export</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-border rounded-lg p-2">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    className="flex items-center space-x-2 p-1.5 rounded hover:bg-muted/50"
                  >
                    <Checkbox
                      id={`clip-${clip.id}`}
                      checked={selectedForExport.includes(clip.id)}
                      onCheckedChange={() => toggleClipSelection(clip.id)}
                    />
                    <Label
                      htmlFor={`clip-${clip.id}`}
                      className="text-sm cursor-pointer flex-1 truncate"
                    >
                      {clip.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={handleExport}
            disabled={selectedForExport.length === 0}
          >
            Export {selectedForExport.length} Clip{selectedForExport.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportConfigModal;
