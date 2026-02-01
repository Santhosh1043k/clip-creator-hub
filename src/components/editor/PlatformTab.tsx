import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlatformSettings, Platform, platformSpecs } from "@/types/clipEditor";
import { Instagram, Youtube, Music2, Linkedin, Check, Plus, X } from "lucide-react";
import { useState } from "react";

interface PlatformTabProps {
  settings: PlatformSettings;
  onChange: (settings: PlatformSettings) => void;
  clipDuration: number;
}

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  tiktok: <Music2 className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
};

const suggestedHashtags: Record<Platform, string[]> = {
  instagram: ["#reels", "#viral", "#trending", "#explore", "#fyp"],
  youtube: ["#shorts", "#viral", "#trending", "#subscribe", "#youtube"],
  tiktok: ["#fyp", "#foryou", "#viral", "#trending", "#tiktok"],
  linkedin: ["#leadership", "#business", "#professional", "#career", "#growth"],
};

const PlatformTab = ({ settings, onChange, clipDuration }: PlatformTabProps) => {
  const [newHashtag, setNewHashtag] = useState("");

  const selectPlatform = (platform: Platform) => {
    const specs = platformSpecs[platform];
    onChange({
      ...settings,
      platform,
      aspectRatio: specs.aspectRatio,
      maxDuration: specs.maxDuration,
    });
  };

  const addHashtag = () => {
    if (newHashtag.trim()) {
      const tag = newHashtag.startsWith("#") ? newHashtag : `#${newHashtag}`;
      if (!settings.hashtags.includes(tag)) {
        onChange({
          ...settings,
          hashtags: [...settings.hashtags, tag],
        });
      }
      setNewHashtag("");
    }
  };

  const removeHashtag = (tag: string) => {
    onChange({
      ...settings,
      hashtags: settings.hashtags.filter((h) => h !== tag),
    });
  };

  const addSuggestedHashtag = (tag: string) => {
    if (!settings.hashtags.includes(tag)) {
      onChange({
        ...settings,
        hashtags: [...settings.hashtags, tag],
      });
    }
  };

  const isValidDuration = clipDuration <= settings.maxDuration;

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Target Platform</Label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(platformSpecs) as Platform[]).map((platform) => {
            const specs = platformSpecs[platform];
            const isSelected = settings.platform === platform;

            return (
              <button
                key={platform}
                onClick={() => selectPlatform(platform)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 glass-card"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={isSelected ? "text-primary" : "text-muted-foreground"}>
                    {platformIcons[platform]}
                  </span>
                  <span className="font-medium">{specs.name}</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Aspect: {specs.aspectRatio}</p>
                  <p>Max: {specs.maxDuration}s</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform Specs */}
      <div className="p-4 glass-card rounded-lg space-y-3">
        <h4 className="font-medium">Optimization Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Aspect Ratio</span>
            <Badge variant="secondary">{settings.aspectRatio}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Duration</span>
            <div className="flex items-center gap-2">
              <Badge variant={isValidDuration ? "default" : "destructive"}>
                {clipDuration.toFixed(1)}s / {settings.maxDuration}s
              </Badge>
              {isValidDuration && <Check className="w-4 h-4 text-primary" />}
            </div>
          </div>
        </div>
        {!isValidDuration && (
          <p className="text-xs text-destructive">
            Your clip exceeds the max duration for {platformSpecs[settings.platform].name}
          </p>
        )}
      </div>

      {/* Hashtags */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Hashtags</Label>

        {/* Current Hashtags */}
        {settings.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {settings.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                {tag}
                <button onClick={() => removeHashtag(tag)} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Add Custom Hashtag */}
        <div className="flex gap-2">
          <Input
            value={newHashtag}
            onChange={(e) => setNewHashtag(e.target.value)}
            placeholder="Add hashtag..."
            onKeyDown={(e) => e.key === "Enter" && addHashtag()}
          />
          <Button onClick={addHashtag} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Suggested Hashtags */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Suggested for {platformSpecs[settings.platform].name}</p>
          <div className="flex flex-wrap gap-2">
            {suggestedHashtags[settings.platform].map((tag) => (
              <Badge
                key={tag}
                variant={settings.hashtags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent"
                onClick={() => addSuggestedHashtag(tag)}
              >
                {tag}
                {settings.hashtags.includes(tag) && <Check className="w-3 h-3 ml-1" />}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformTab;
