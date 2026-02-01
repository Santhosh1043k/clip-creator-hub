import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, FolderOpen, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types/dashboard";
import { useNavigate } from "react-router-dom";

interface ProjectGridProps {
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (project: Project) => void;
}

const ProjectGrid = ({ projects, onUpdate, onDelete, onDuplicate }: ProjectGridProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Filter by search
    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
        break;
      case "clips":
        result.sort((a, b) => b.clipCount - a.clipCount);
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [projects, searchQuery, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Recent Projects</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="clips">Most Clips</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 rounded-xl border border-dashed border-border"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            Upload your first video to start creating viral clips
          </p>
          <Button variant="hero" onClick={() => navigate("/upload")}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </motion.div>
      )}

      {/* No search results */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects match your search</p>
        </div>
      )}

      {/* Project Grid */}
      {filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.slice(0, 10).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectGrid;
