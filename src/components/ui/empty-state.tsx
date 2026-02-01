import { motion } from "framer-motion";
import { FolderOpen, Upload, Inbox, Search, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  type: "projects" | "clips" | "downloads" | "search" | "video";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const icons = {
  projects: FolderOpen,
  clips: Video,
  downloads: Inbox,
  search: Search,
  video: Upload,
};

const defaults = {
  projects: {
    title: "No projects yet",
    description: "Upload your first video to start creating viral clips",
    actionLabel: "Upload Video",
  },
  clips: {
    title: "No clips found",
    description: "Process a video to automatically detect the best moments",
    actionLabel: "Find Clips",
  },
  downloads: {
    title: "No exports yet",
    description: "Export some clips to see them here",
    actionLabel: "Create Clips",
  },
  search: {
    title: "No results found",
    description: "Try adjusting your search or filters",
    actionLabel: "Clear Search",
  },
  video: {
    title: "No video selected",
    description: "Upload a video to get started",
    actionLabel: "Upload Video",
  },
};

const EmptyState = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const navigate = useNavigate();
  const Icon = icons[type];
  const defaultContent = defaults[type];

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate("/upload");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center"
      >
        <Icon className="w-10 h-10 text-muted-foreground" />
      </motion.div>

      <h3 className="text-xl font-semibold mb-2">
        {title || defaultContent.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {description || defaultContent.description}
      </p>

      <Button variant="hero" onClick={handleAction}>
        {actionLabel || defaultContent.actionLabel}
      </Button>
    </motion.div>
  );
};

export default EmptyState;
