import { useState, useEffect, useCallback } from "react";
import { Project, UserStats, UserSettings, defaultUserSettings } from "@/types/dashboard";

const PROJECTS_KEY = "contentrepurpose_projects";
const SETTINGS_KEY = "contentrepurpose_settings";
const STATS_KEY = "contentrepurpose_stats";
const ONBOARDING_KEY = "contentrepurpose_onboarding_complete";

// Generate mock weekly activity
const generateWeeklyActivity = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    clips: Math.floor(Math.random() * 8),
  }));
};

export const useDashboardData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalVideosProcessed: 0,
    clipsCreated: 0,
    hoursSaved: 0,
    weeklyActivity: generateWeeklyActivity(),
  });
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);

  // Load data on mount
  useEffect(() => {
    try {
      // Load projects
      const storedProjects = localStorage.getItem(PROJECTS_KEY);
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects).map((p: Project) => ({
          ...p,
          uploadDate: new Date(p.uploadDate),
        }));
        setProjects(parsed);
      }

      // Load settings
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      // Load stats
      const storedStats = localStorage.getItem(STATS_KEY);
      if (storedStats) {
        setStats({
          ...JSON.parse(storedStats),
          weeklyActivity: generateWeeklyActivity(),
        });
      }

      // Check onboarding
      const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(onboardingComplete === "true");

      // Calculate storage
      calculateStorageUsed();
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }, []);

  const calculateStorageUsed = () => {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += localStorage.getItem(key)?.length || 0;
      }
    }
    // Convert to MB (rough estimate)
    setStorageUsed(total / (1024 * 1024));
  };

  const saveProjects = useCallback((updated: Project[]) => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    setProjects(updated);
  }, []);

  const addProject = useCallback(
    (project: Omit<Project, "id" | "uploadDate">) => {
      const newProject: Project = {
        ...project,
        id: `project-${Date.now()}`,
        uploadDate: new Date(),
      };
      const updated = [newProject, ...projects];
      saveProjects(updated);

      // Update stats
      const newStats = {
        ...stats,
        totalVideosProcessed: stats.totalVideosProcessed + 1,
      };
      setStats(newStats);
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats));

      return newProject;
    },
    [projects, stats, saveProjects]
  );

  const updateProject = useCallback(
    (projectId: string, updates: Partial<Project>) => {
      const updated = projects.map((p) =>
        p.id === projectId ? { ...p, ...updates } : p
      );
      saveProjects(updated);
    },
    [projects, saveProjects]
  );

  const deleteProject = useCallback(
    (projectId: string) => {
      const updated = projects.filter((p) => p.id !== projectId);
      saveProjects(updated);
    },
    [projects, saveProjects]
  );

  const incrementClipsCreated = useCallback(
    (count: number = 1) => {
      const newStats = {
        ...stats,
        clipsCreated: stats.clipsCreated + count,
        hoursSaved: stats.hoursSaved + count * 0.25, // Assume 15 min saved per clip
      };
      setStats(newStats);
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    },
    [stats]
  );

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  }, [settings]);

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true);
    localStorage.setItem(ONBOARDING_KEY, "true");
  }, []);

  const resetOnboarding = useCallback(() => {
    setHasCompletedOnboarding(false);
    localStorage.removeItem(ONBOARDING_KEY);
  }, []);

  return {
    projects,
    stats,
    settings,
    storageUsed,
    hasCompletedOnboarding,
    addProject,
    updateProject,
    deleteProject,
    incrementClipsCreated,
    updateSettings,
    completeOnboarding,
    resetOnboarding,
  };
};
