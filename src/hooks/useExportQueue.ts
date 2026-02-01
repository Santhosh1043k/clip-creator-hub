import { useState, useCallback, useEffect } from "react";
import { ExportJob, ExportConfig, ExportedClip } from "@/types/export";
import { Clip } from "@/types/clip";
import { useExportStorage } from "./useExportStorage";

export const useExportQueue = () => {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addExportedClip } = useExportStorage();

  // Process jobs sequentially
  useEffect(() => {
    const processNextJob = async () => {
      const nextJob = jobs.find((j) => j.status === "queued");
      if (!nextJob || isProcessing) return;

      setIsProcessing(true);

      // Update job to processing
      setJobs((prev) =>
        prev.map((j) =>
          j.id === nextJob.id ? { ...j, status: "processing" as const } : j
        )
      );

      // Simulate processing with progress updates
      const duration = 3000 + Math.random() * 2000; // 3-5 seconds
      const startTime = Date.now();
      const intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(Math.round((elapsed / duration) * 100), 99);
        const remaining = Math.max(0, Math.round((duration - elapsed) / 1000));

        setJobs((prev) =>
          prev.map((j) =>
            j.id === nextJob.id
              ? { ...j, progress, estimatedTimeRemaining: remaining }
              : j
          )
        );
      }, 100);

      // Wait for completion
      await new Promise((resolve) => setTimeout(resolve, duration));
      clearInterval(intervalId);

      // Mark as complete and save to storage
      const completedJob: ExportJob = {
        ...nextJob,
        status: "complete",
        progress: 100,
        estimatedTimeRemaining: 0,
        completedAt: new Date(),
        fileSize: `${(5 + Math.random() * 20).toFixed(1)} MB`,
        downloadUrl: `https://example.com/download/${nextJob.id}`,
      };

      setJobs((prev) =>
        prev.map((j) => (j.id === nextJob.id ? completedJob : j))
      );

      // Add to exported clips storage
      const exportedClip: ExportedClip = {
        id: nextJob.id,
        title: nextJob.clipTitle,
        thumbnail: nextJob.thumbnail,
        platform: nextJob.config.platform || "generic",
        platformBadges: nextJob.config.platform
          ? [nextJob.config.platform]
          : ["Custom"],
        fileSize: completedJob.fileSize!,
        exportDate: new Date(),
        downloadUrl: completedJob.downloadUrl!,
        shareLink: `https://share.contentrepurpose.com/${nextJob.id}`,
        hashtags: generateHashtags(nextJob.config.platform),
      };
      addExportedClip(exportedClip);

      setIsProcessing(false);
    };

    processNextJob();
  }, [jobs, isProcessing, addExportedClip]);

  const addToQueue = useCallback(
    (clips: Clip[], config: ExportConfig) => {
      const newJobs: ExportJob[] = clips.map((clip) => ({
        id: `export-${clip.id}-${Date.now()}`,
        clipId: clip.id,
        clipTitle: clip.title,
        thumbnail: clip.thumbnail,
        status: "queued" as const,
        progress: 0,
        estimatedTimeRemaining: 5,
        config,
        createdAt: new Date(),
      }));

      setJobs((prev) => [...prev, ...newJobs]);
      return newJobs;
    },
    []
  );

  const cancelJob = useCallback((jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId && (j.status === "queued" || j.status === "processing")
          ? { ...j, status: "failed" as const, error: "Cancelled by user" }
          : j
      )
    );
  }, []);

  const clearCompletedJobs = useCallback(() => {
    setJobs((prev) =>
      prev.filter((j) => j.status !== "complete" && j.status !== "failed")
    );
  }, []);

  const getCompletedClips = useCallback((): ExportedClip[] => {
    return jobs
      .filter((j) => j.status === "complete")
      .map((j) => ({
        id: j.id,
        title: j.clipTitle,
        thumbnail: j.thumbnail,
        platform: j.config.platform || "generic",
        platformBadges: j.config.platform
          ? [j.config.platform]
          : ["Custom"],
        fileSize: j.fileSize || "Unknown",
        exportDate: j.completedAt || new Date(),
        downloadUrl: j.downloadUrl || "",
        shareLink: `https://share.contentrepurpose.com/${j.id}`,
        hashtags: generateHashtags(j.config.platform),
      }));
  }, [jobs]);

  return {
    jobs,
    addToQueue,
    cancelJob,
    clearCompletedJobs,
    getCompletedClips,
    hasActiveJobs: jobs.some(
      (j) => j.status === "queued" || j.status === "processing"
    ),
    allComplete: jobs.length > 0 && jobs.every(
      (j) => j.status === "complete" || j.status === "failed"
    ),
  };
};

const generateHashtags = (platform: string | null): string[] => {
  const base = ["#viral", "#trending", "#fyp", "#content"];
  const platformTags: Record<string, string[]> = {
    tiktok: ["#tiktok", "#tiktokviral", "#foryou", "#foryoupage"],
    instagram: ["#reels", "#instareels", "#instagram", "#explore"],
    youtube: ["#shorts", "#youtubeshorts", "#youtube", "#subscribe"],
    linkedin: ["#linkedin", "#professional", "#business", "#networking"],
  };

  return [...base, ...(platformTags[platform || ""] || [])].slice(0, 8);
};
