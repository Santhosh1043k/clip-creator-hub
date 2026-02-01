import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Trash2,
  MoreVertical,
  Edit2,
  Check,
  X,
  Copy,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Project } from "@/types/dashboard";
import { toast } from "sonner";

interface ProjectCardProps {
  project: Project;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (project: Project) => void;
}

const ProjectCard = ({ project, onUpdate, onDelete, onDuplicate }: ProjectCardProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onUpdate(project.id, { title: editTitle.trim() });
      toast.success("Project renamed");
    }
    setIsEditing(false);
  };

  const handleViewClips = () => {
    navigate(`/upload?project=${project.id}`);
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(project);
      toast.success("Project duplicated");
    }
  };

  const handleDelete = () => {
    onDelete(project.id);
    setShowDeleteDialog(false);
    toast.success("Project deleted");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className="group relative rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all"
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <FolderOpen className="w-10 h-10 text-muted-foreground" />
            </div>
          )}

          {/* Play overlay */}
          <button
            onClick={handleViewClips}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </button>

          {/* Status badge */}
          {project.status === "processing" && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary/90 text-xs font-medium text-primary-foreground">
              Processing...
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          {isEditing ? (
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setIsEditing(false);
                }}
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveTitle}>
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <h3 className="font-medium text-sm truncate mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(project.uploadDate)}</span>
            <span>{project.clipCount} clips</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <Button variant="ghost" size="sm" className="h-8" onClick={handleViewClips}>
              View Clips
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{project.title}" and all its clips. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;
