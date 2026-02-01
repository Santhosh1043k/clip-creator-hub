import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Trash2,
  Share2,
  Copy,
  Grid,
  List,
  Filter,
  Search,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useExportStorage } from "@/hooks/useExportStorage";
import { ExportedClip } from "@/types/export";
import { toast } from "sonner";

const Downloads = () => {
  const navigate = useNavigate();
  const { exportedClips, removeExportedClip, clearAllExports } = useExportStorage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedClips, setSelectedClips] = useState<string[]>([]);

  // Filter clips
  const filteredClips = exportedClips.filter((clip) => {
    const matchesSearch = clip.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "all" || clip.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  // Get unique platforms
  const platforms = [...new Set(exportedClips.map((c) => c.platform))];

  const toggleClipSelection = (clipId: string) => {
    setSelectedClips((prev) =>
      prev.includes(clipId)
        ? prev.filter((id) => id !== clipId)
        : [...prev, clipId]
    );
  };

  const handleDownload = (clip: ExportedClip) => {
    toast.success(`Downloading "${clip.title}"...`);
    // Simulate download
  };

  const handleDownloadAll = () => {
    const toDownload = selectedClips.length > 0 
      ? filteredClips.filter((c) => selectedClips.includes(c.id))
      : filteredClips;
    toast.success(`Downloading ${toDownload.length} clips...`);
  };

  const handleDelete = (clipId: string) => {
    removeExportedClip(clipId);
    setSelectedClips((prev) => prev.filter((id) => id !== clipId));
    toast.success("Clip deleted");
  };

  const handleDeleteAll = () => {
    if (selectedClips.length > 0) {
      selectedClips.forEach((id) => removeExportedClip(id));
      setSelectedClips([]);
      toast.success(`Deleted ${selectedClips.length} clips`);
    } else {
      clearAllExports();
      toast.success("All clips deleted");
    }
  };

  const copyShareLink = (clip: ExportedClip) => {
    navigator.clipboard.writeText(clip.shareLink);
    toast.success("Share link copied!");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold">
                <span className="gradient-text">Downloads</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                {exportedClips.length} exported clip{exportedClips.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Filters & Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadAll}>
                <Download className="w-4 h-4 mr-2" />
                Download {selectedClips.length > 0 ? `(${selectedClips.length})` : "All"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete {selectedClips.length > 0 ? `(${selectedClips.length})` : "All"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Clips?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {selectedClips.length > 0 ? selectedClips.length : exportedClips.length} clip{(selectedClips.length > 0 ? selectedClips.length : exportedClips.length) !== 1 ? "s" : ""}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredClips.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Download className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No exported clips yet</h3>
              <p className="text-muted-foreground mb-4">
                Export some clips to see them here
              </p>
              <Button variant="hero" onClick={() => navigate("/upload")}>
                Create Clips
              </Button>
            </motion.div>
          )}

          {/* Grid View */}
          {filteredClips.length > 0 && viewMode === "grid" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {filteredClips.map((clip, index) => (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative rounded-lg border bg-card overflow-hidden ${
                      selectedClips.includes(clip.id)
                        ? "ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleClipSelection(clip.id)}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-muted relative">
                      {clip.thumbnail ? (
                        <img
                          src={clip.thumbnail}
                          alt={clip.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Download className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      {selectedClips.includes(clip.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-2">
                      <h3 className="font-medium text-sm truncate">{clip.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {clip.platformBadges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{clip.fileSize}</span>
                        <span>{formatDate(clip.exportDate)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(clip);
                          }}
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyShareLink(clip);
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(clip.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* List View */}
          {filteredClips.length > 0 && viewMode === "list" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <AnimatePresence>
                {filteredClips.map((clip, index) => (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    className={`flex items-center gap-4 p-3 rounded-lg border bg-card cursor-pointer ${
                      selectedClips.includes(clip.id)
                        ? "ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleClipSelection(clip.id)}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                      {clip.thumbnail ? (
                        <img
                          src={clip.thumbnail}
                          alt={clip.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{clip.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {clip.platformBadges.slice(0, 2).map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground">
                          {clip.fileSize} • {formatDate(clip.exportDate)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(clip);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyShareLink(clip);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(clip.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Downloads;
