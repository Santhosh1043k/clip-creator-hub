import { useState, useCallback, useRef } from "react";
import { Upload, FileVideo, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface UploadState {
  status: "idle" | "dragging" | "uploading" | "success" | "error";
  progress: number;
  file: File | null;
  error: string | null;
}

const ACCEPTED_FORMATS = ["video/mp4", "video/quicktime", "video/x-msvideo"];
const MAX_SIZE_MB = 500;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface VideoUploadZoneProps {
  onUploadComplete: (file: File) => void;
}

const VideoUploadZone = ({ onUploadComplete }: VideoUploadZoneProps) => {
  const [state, setState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    file: null,
    error: null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return "Invalid format. Please upload MP4, MOV, or AVI files.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const simulateUpload = useCallback((file: File) => {
    setState(prev => ({ ...prev, status: "uploading", file, progress: 0, error: null }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setState(prev => ({ ...prev, status: "success", progress: 100 }));
        onUploadComplete(file);
      } else {
        setState(prev => ({ ...prev, progress }));
      }
    }, 200);
  }, [onUploadComplete]);

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setState(prev => ({ ...prev, status: "error", error, file: null }));
      return;
    }
    simulateUpload(file);
  }, [simulateUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, status: "idle" }));
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, status: "dragging" }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, status: "idle" }));
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const resetUpload = () => {
    setState({
      status: "idle",
      progress: 0,
      file: null,
      error: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,.mov,.avi"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <motion.div
        className={`upload-zone p-12 cursor-pointer relative ${
          state.status === "dragging" ? "upload-zone-active" : ""
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: state.status === "idle" ? 1.01 : 1 }}
        whileTap={{ scale: state.status === "idle" ? 0.99 : 1 }}
      >
        <AnimatePresence mode="wait">
          {state.status === "idle" || state.status === "dragging" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                animate={{
                  y: state.status === "dragging" ? -10 : 0,
                  scale: state.status === "dragging" ? 1.1 : 1,
                }}
              >
                <Upload className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">
                {state.status === "dragging" ? "Drop your video here" : "Drag & drop your video"}
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileVideo className="w-4 h-4" />
                  MP4, MOV, AVI
                </span>
                <span>•</span>
                <span>Max {MAX_SIZE_MB}MB</span>
              </div>
            </motion.div>
          ) : state.status === "uploading" ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="w-10 h-10 text-primary" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Uploading...</h3>
              <p className="text-muted-foreground mb-6">{state.file?.name}</p>
              <div className="max-w-xs mx-auto">
                <Progress value={state.progress} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">{Math.round(state.progress)}%</p>
              </div>
            </motion.div>
          ) : state.status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Upload Complete!</h3>
              <p className="text-muted-foreground mb-4">{state.file?.name}</p>
              <Button variant="ghost" size="sm" onClick={resetUpload}>
                Upload another video
              </Button>
            </motion.div>
          ) : state.status === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Failed</h3>
              <p className="text-destructive mb-4">{state.error}</p>
              <Button variant="ghost" size="sm" onClick={resetUpload}>
                Try again
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VideoUploadZone;
