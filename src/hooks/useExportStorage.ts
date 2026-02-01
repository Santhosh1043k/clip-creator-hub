import { useState, useEffect, useCallback } from "react";
import { ExportedClip } from "@/types/export";

const STORAGE_KEY = "contentrepurpose_exports";

export const useExportStorage = () => {
  const [exportedClips, setExportedClips] = useState<ExportedClip[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const clips = parsed.map((clip: ExportedClip) => ({
          ...clip,
          exportDate: new Date(clip.exportDate),
        }));
        setExportedClips(clips);
      }
    } catch (error) {
      console.error("Failed to load exports from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever exports change
  const saveToStorage = useCallback((clips: ExportedClip[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clips));
    } catch (error) {
      console.error("Failed to save exports to localStorage:", error);
    }
  }, []);

  const addExportedClip = useCallback((clip: ExportedClip) => {
    setExportedClips((prev) => {
      const updated = [clip, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeExportedClip = useCallback((clipId: string) => {
    setExportedClips((prev) => {
      const updated = prev.filter((c) => c.id !== clipId);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const clearAllExports = useCallback(() => {
    setExportedClips([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getClipsByPlatform = useCallback((platform: string) => {
    return exportedClips.filter((clip) => clip.platform === platform);
  }, [exportedClips]);

  const getClipsByDateRange = useCallback((start: Date, end: Date) => {
    return exportedClips.filter((clip) => {
      const exportDate = new Date(clip.exportDate);
      return exportDate >= start && exportDate <= end;
    });
  }, [exportedClips]);

  return {
    exportedClips,
    addExportedClip,
    removeExportedClip,
    clearAllExports,
    getClipsByPlatform,
    getClipsByDateRange,
  };
};
