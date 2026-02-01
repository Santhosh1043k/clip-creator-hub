import { useEffect, useCallback } from "react";
import { toast } from "sonner";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

export const useVideoKeyboardShortcuts = (
  videoRef: React.RefObject<HTMLVideoElement>,
  options?: {
    onPlayPause?: () => void;
    onSeekForward?: () => void;
    onSeekBackward?: () => void;
  }
) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: " ",
      description: "Play/Pause",
      action: () => {
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
          options?.onPlayPause?.();
        }
      },
    },
    {
      key: "ArrowRight",
      description: "Skip forward 5s",
      action: () => {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + 5
          );
          options?.onSeekForward?.();
        }
      },
    },
    {
      key: "ArrowLeft",
      description: "Skip backward 5s",
      action: () => {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          options?.onSeekBackward?.();
        }
      },
    },
    {
      key: "ArrowUp",
      description: "Volume up",
      action: () => {
        if (videoRef.current) {
          videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
        }
      },
    },
    {
      key: "ArrowDown",
      description: "Volume down",
      action: () => {
        if (videoRef.current) {
          videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
        }
      },
    },
    {
      key: "m",
      description: "Mute/Unmute",
      action: () => {
        if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
        }
      },
    },
    {
      key: "f",
      description: "Fullscreen",
      action: () => {
        if (videoRef.current) {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            videoRef.current.requestFullscreen();
          }
        }
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
};
