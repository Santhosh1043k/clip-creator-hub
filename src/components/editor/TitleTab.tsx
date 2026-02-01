import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TitleSettings, TitleAnimation } from "@/types/clipEditor";
import { Sparkles, RefreshCw } from "lucide-react";

interface TitleTabProps {
  settings: TitleSettings;
  onChange: (settings: TitleSettings) => void;
  clipTitle: string;
}

const animationLabels: Record<TitleAnimation, string> = {
  "fade-in": "Fade In",
  "slide-up": "Slide Up",
  "typewriter": "Typewriter",
};

const generateTitleSuggestions = (clipTitle: string): string[] => {
  const templates = [
    `🔥 ${clipTitle}`,
    `Wait for it... ${clipTitle.toLowerCase()}`,
    `This is INSANE: ${clipTitle}`,
  ];
  return templates;
};

const TitleTab = ({ settings, onChange, clipTitle }: TitleTabProps) => {
  const [suggestions, setSuggestions] = useState<string[]>(() =>
    generateTitleSuggestions(clipTitle)
  );

  const regenerateSuggestions = () => {
    const newSuggestions = [
      `You won't believe this ${clipTitle.toLowerCase()}`,
      `The moment when ${clipTitle.toLowerCase()}`,
      `${clipTitle} - must watch! 👀`,
    ];
    setSuggestions(newSuggestions);
  };

  return (
    <div className="space-y-6">
      {/* AI Title Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <Label className="text-sm font-medium">AI Title Suggestions</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={regenerateSuggestions}
            className="h-8 gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Regenerate
          </Button>
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant={settings.text === suggestion ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => onChange({ ...settings, text: suggestion })}
            >
              <span className="truncate">{suggestion}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Title */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Custom Title</Label>
        <Input
          value={settings.text}
          onChange={(e) => onChange({ ...settings, text: e.target.value })}
          placeholder="Enter your title..."
        />
      </div>

      {/* Title Animation */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Title Animation</Label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(animationLabels) as TitleAnimation[]).map((animation) => (
            <Button
              key={animation}
              variant={settings.animation === animation ? "default" : "outline"}
              size="sm"
              onClick={() => onChange({ ...settings, animation })}
            >
              {animationLabels[animation]}
            </Button>
          ))}
        </div>
      </div>

      {/* Hook Section */}
      <div className="p-4 glass-card rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Hook Text</Label>
            <p className="text-sm text-muted-foreground">
              Appears in first 3 seconds to grab attention
            </p>
          </div>
          <Switch
            checked={settings.hookEnabled}
            onCheckedChange={(hookEnabled) =>
              onChange({ ...settings, hookEnabled })
            }
          />
        </div>

        {settings.hookEnabled && (
          <Input
            value={settings.hookText}
            onChange={(e) => onChange({ ...settings, hookText: e.target.value })}
            placeholder="e.g., 'Watch until the end!' or 'This changed everything'"
          />
        )}
      </div>
    </div>
  );
};

export default TitleTab;
