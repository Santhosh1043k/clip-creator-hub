import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { VisualSettings, EmojiReaction, ProgressBarPosition } from "@/types/clipEditor";
import { Plus, X, Sparkles, ZoomIn, Film } from "lucide-react";
import { useState } from "react";

interface VisualTabProps {
  settings: VisualSettings;
  onChange: (settings: VisualSettings) => void;
  currentTime: number;
  clipDuration: number;
}

const popularEmojis = ["🔥", "😂", "😱", "👀", "💯", "❤️", "🎯", "⚡", "✨", "🚀"];

const progressBarOptions: { value: ProgressBarPosition; label: string }[] = [
  { value: "none", label: "None" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
];

const VisualTab = ({ settings, onChange, currentTime, clipDuration }: VisualTabProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState("🔥");

  const addEmoji = () => {
    const newEmoji: EmojiReaction = {
      id: `emoji-${Date.now()}`,
      emoji: selectedEmoji,
      timestamp: currentTime,
      position: {
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
      },
    };
    onChange({
      ...settings,
      emojis: [...settings.emojis, newEmoji],
    });
  };

  const removeEmoji = (id: string) => {
    onChange({
      ...settings,
      emojis: settings.emojis.filter((e) => e.id !== id),
    });
  };

  const addZoomEffect = () => {
    const newZoom = {
      id: `zoom-${Date.now()}`,
      startTime: currentTime,
      endTime: Math.min(currentTime + 2, clipDuration),
      zoomLevel: 1.3,
    };
    onChange({
      ...settings,
      zoomEffects: [...settings.zoomEffects, newZoom],
    });
  };

  return (
    <div className="space-y-6">
      {/* Emoji Reactions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Emoji Reactions</Label>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {popularEmojis.map((emoji) => (
            <Button
              key={emoji}
              variant={selectedEmoji === emoji ? "default" : "outline"}
              size="sm"
              className="text-lg w-10 h-10 p-0"
              onClick={() => setSelectedEmoji(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>

        <Button variant="outline" onClick={addEmoji} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add at {currentTime.toFixed(1)}s
        </Button>

        {settings.emojis.length > 0 && (
          <div className="space-y-2 p-3 glass-card rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Active Emojis</p>
            <div className="flex flex-wrap gap-2">
              {settings.emojis.map((emoji) => (
                <Badge key={emoji.id} variant="secondary" className="gap-1 pr-1">
                  {emoji.emoji} @ {emoji.timestamp.toFixed(1)}s
                  <button
                    onClick={() => removeEmoji(emoji.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Progress Bar</Label>
        <div className="grid grid-cols-3 gap-2">
          {progressBarOptions.map((option) => (
            <Button
              key={option.value}
              variant={settings.progressBar === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onChange({ ...settings, progressBar: option.value })}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Zoom Effects */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ZoomIn className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">Zoom Effects</Label>
        </div>
        <Button variant="outline" onClick={addZoomEffect} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Zoom at {currentTime.toFixed(1)}s
        </Button>
        {settings.zoomEffects.length > 0 && (
          <div className="space-y-2">
            {settings.zoomEffects.map((zoom) => (
              <div
                key={zoom.id}
                className="flex items-center justify-between p-2 glass-card rounded-lg"
              >
                <span className="text-sm">
                  {zoom.startTime.toFixed(1)}s - {zoom.endTime.toFixed(1)}s
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...settings,
                      zoomEffects: settings.zoomEffects.filter((z) => z.id !== zoom.id),
                    })
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* B-Roll Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">B-Roll Suggestions</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {settings.brollSuggestions.map((suggestion, index) => (
            <Badge key={index} variant="outline" className="cursor-pointer hover:bg-accent">
              {suggestion}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Click to mark where you'd add this B-roll footage
        </p>
      </div>
    </div>
  );
};

export default VisualTab;
