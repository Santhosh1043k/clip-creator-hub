import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Video,
  Type,
  Share2,
  Bell,
  HardDrive,
  RotateCcw,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toast } from "sonner";

const CAPTION_STYLES = [
  { id: "minimal", label: "Minimal", description: "Clean and simple" },
  { id: "bold", label: "Bold", description: "Eye-catching and impactful" },
  { id: "podcast", label: "Podcast Style", description: "Conversational feel" },
  { id: "mrbeast", label: "MrBeast Style", description: "High energy with animations" },
];

const PLATFORMS = [
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram Reels" },
  { id: "youtube", label: "YouTube Shorts" },
  { id: "linkedin", label: "LinkedIn" },
];

const SettingsPage = () => {
  const { settings, updateSettings, storageUsed, resetOnboarding } = useDashboardData();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    toast.success("Settings saved!");
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    toast.success("Onboarding reset. Refresh to see the tour again.");
  };

  const toggleCaptionStyle = (styleId: string) => {
    const current = localSettings.favoriteCaptionStyles;
    const updated = current.includes(styleId)
      ? current.filter((s) => s !== styleId)
      : [...current, styleId];
    setLocalSettings({ ...localSettings, favoriteCaptionStyles: updated });
  };

  const togglePlatform = (platformId: string) => {
    const current = localSettings.platformPreferences;
    const updated = current.includes(platformId)
      ? current.filter((p) => p !== platformId)
      : [...current, platformId];
    setLocalSettings({ ...localSettings, platformPreferences: updated });
  };

  const storagePercentage = Math.min((storageUsed / 50) * 100, 100); // 50MB limit

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-muted-foreground">
              Customize your ContentRepurpose experience
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Export Defaults */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Export Defaults</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Quality</Label>
                  <Select
                    value={localSettings.defaultQuality}
                    onValueChange={(v) =>
                      setLocalSettings({ ...localSettings, defaultQuality: v as typeof localSettings.defaultQuality })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (1080p)</SelectItem>
                      <SelectItem value="medium">Medium (720p)</SelectItem>
                      <SelectItem value="low">Low (480p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Format</Label>
                  <Select
                    value={localSettings.defaultFormat}
                    onValueChange={(v) =>
                      setLocalSettings({ ...localSettings, defaultFormat: v as typeof localSettings.defaultFormat })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.section>

            {/* Caption Styles */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Favorite Caption Styles</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select your preferred styles for quick access in the editor
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {CAPTION_STYLES.map((style) => (
                  <label
                    key={style.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      localSettings.favoriteCaptionStyles.includes(style.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={localSettings.favoriteCaptionStyles.includes(style.id)}
                      onCheckedChange={() => toggleCaptionStyle(style.id)}
                    />
                    <div>
                      <div className="font-medium text-sm">{style.label}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </motion.section>

            {/* Platform Preferences */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Platform Preferences</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your primary platforms for quick optimization
              </p>

              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => (
                  <Badge
                    key={platform.id}
                    variant={
                      localSettings.platformPreferences.includes(platform.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => togglePlatform(platform.id)}
                  >
                    {platform.label}
                  </Badge>
                ))}
              </div>
            </motion.section>

            {/* Notifications */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Export Complete</div>
                    <div className="text-xs text-muted-foreground">
                      Get notified when exports finish
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.notifications.exportComplete}
                    onCheckedChange={(v) =>
                      setLocalSettings({
                        ...localSettings,
                        notifications: { ...localSettings.notifications, exportComplete: v },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Weekly Report</div>
                    <div className="text-xs text-muted-foreground">
                      Summary of your activity
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.notifications.weeklyReport}
                    onCheckedChange={(v) =>
                      setLocalSettings({
                        ...localSettings,
                        notifications: { ...localSettings.notifications, weeklyReport: v },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Tips & Tricks</div>
                    <div className="text-xs text-muted-foreground">
                      Learn new features and best practices
                    </div>
                  </div>
                  <Switch
                    checked={localSettings.notifications.tips}
                    onCheckedChange={(v) =>
                      setLocalSettings({
                        ...localSettings,
                        notifications: { ...localSettings.notifications, tips: v },
                      })
                    }
                  />
                </div>
              </div>
            </motion.section>

            {/* Storage */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Storage Usage</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Local storage used</span>
                  <span className="font-medium">{storageUsed.toFixed(2)} MB / 50 MB</span>
                </div>
                <Progress value={storagePercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  This includes project metadata and settings. Video files are not stored locally.
                </p>
              </div>
            </motion.section>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-between"
            >
              <Button variant="outline" onClick={handleResetOnboarding} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset Onboarding
              </Button>
              <Button variant="hero" onClick={handleSave}>
                Save Settings
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
