import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExportJob } from "@/types/export";

interface ExportProcessingModalProps {
  isOpen: boolean;
  jobs: ExportJob[];
  onCancel: (jobId: string) => void;
  onClose: () => void;
}

const ExportProcessingModal = ({
  isOpen,
  jobs,
  onCancel,
  onClose,
}: ExportProcessingModalProps) => {
  const completedCount = jobs.filter((j) => j.status === "complete").length;
  const failedCount = jobs.filter((j) => j.status === "failed").length;
  const processingCount = jobs.filter((j) => j.status === "processing").length;
  const totalProgress = jobs.length > 0 
    ? Math.round(jobs.reduce((sum, j) => sum + j.progress, 0) / jobs.length)
    : 0;

  const allDone = jobs.every((j) => j.status === "complete" || j.status === "failed");

  const getStatusIcon = (status: ExportJob["status"]) => {
    switch (status) {
      case "queued":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case "complete":
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusText = (job: ExportJob) => {
    switch (job.status) {
      case "queued":
        return "Queued";
      case "processing":
        return `${job.progress}% - ${job.estimatedTimeRemaining}s remaining`;
      case "complete":
        return "Complete";
      case "failed":
        return job.error || "Failed";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => allDone && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {allDone ? "Export Complete" : "Exporting Clips..."}
          </DialogTitle>
          <DialogDescription>
            {allDone 
              ? `${completedCount} of ${jobs.length} clips exported successfully`
              : `Processing ${processingCount} of ${jobs.length} clips`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{totalProgress}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>

          {/* Job List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border ${
                    job.status === "processing"
                      ? "border-primary/30 bg-primary/5"
                      : job.status === "complete"
                      ? "border-green-500/30 bg-green-500/5"
                      : job.status === "failed"
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getStatusIcon(job.status)}
                      <span className="text-sm font-medium truncate">
                        {job.clipTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {getStatusText(job)}
                      </span>
                      {(job.status === "queued" || job.status === "processing") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onCancel(job.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {job.status === "processing" && (
                    <Progress value={job.progress} className="h-1 mt-2" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary when done */}
          {allDone && (
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="hero" onClick={onClose}>
                View Downloads
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportProcessingModal;
