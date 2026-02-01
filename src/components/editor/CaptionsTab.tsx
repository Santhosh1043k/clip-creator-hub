import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaptionSettings, CaptionStyle, CaptionPosition, captionStylePresets } from "@/types/clipEditor";

interface CaptionsTabProps {
  settings: CaptionSettings;
  onChange: (settings: CaptionSettings) => void;
}

const styleLabels: Record<CaptionStyle, string> = {
  minimal: "Minimal",
  bold: "Bold",
  podcast: "Podcast Style",
  mrbeast: "MrBeast Style",
};

const positionLabels: Record<CaptionPosition, string> = {
  top: "Top",
  center: "Center",
  bottom: "Bottom",
};

const CaptionsTab = ({ settings, onChange }: CaptionsTabProps) => {
  const applyPreset = (style: CaptionStyle) => {
    const preset = captionStylePresets[style];
    onChange({
      ...settings,
      style,
      ...preset,
    });
  };

  return (
    <div className="space-y-6">
      {/* Enable Captions */}
      <div className="flex items-center justify-between p-4 glass-card rounded-lg">
        <div>
          <Label className="text-base font-medium">Auto-Captions</Label>
          <p className="text-sm text-muted-foreground">Display captions on your clip</p>
        </div>
        <Switch
          checked={settings.enabled}
          onCheckedChange={(enabled) => onChange({ ...settings, enabled })}
        />
      </div>

      {settings.enabled && (
        <>
          {/* Style Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Caption Style</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(styleLabels) as CaptionStyle[]).map((style) => (
                <Button
                  key={style}
                  variant={settings.style === style ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => applyPreset(style)}
                >
                  {styleLabels[style]}
                </Button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Position</Label>
            <Select
              value={settings.position}
              onValueChange={(value: CaptionPosition) =>
                onChange({ ...settings, position: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(positionLabels) as CaptionPosition[]).map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {positionLabels[pos]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Font Size</Label>
              <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([fontSize]) => onChange({ ...settings, fontSize })}
              min={12}
              max={48}
              step={1}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => onChange({ ...settings, textColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <span className="text-sm text-muted-foreground font-mono">
                  {settings.textColor}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Background</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => onChange({ ...settings, backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <span className="text-sm text-muted-foreground font-mono">
                  {settings.backgroundColor}
                </span>
              </div>
            </div>
          </div>

          {/* Background Opacity */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Background Opacity</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(settings.backgroundOpacity * 100)}%
              </span>
            </div>
            <Slider
              value={[settings.backgroundOpacity * 100]}
              onValueChange={([opacity]) =>
                onChange({ ...settings, backgroundOpacity: opacity / 100 })
              }
              min={0}
              max={100}
              step={5}
            />
          </div>

          {/* Caption Text */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Caption Text</Label>
            <Textarea
              value={settings.text}
              onChange={(e) => onChange({ ...settings, text: e.target.value })}
              placeholder="Enter your caption text..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CaptionsTab;
