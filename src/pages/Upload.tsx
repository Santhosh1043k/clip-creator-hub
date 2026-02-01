import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/layout/Header";
import VideoUploadZone from "@/components/upload/VideoUploadZone";
import VideoPreview from "@/components/upload/VideoPreview";
import ProcessingScreen from "@/components/processing/ProcessingScreen";
import ClipResultsGrid from "@/components/clips/ClipResultsGrid";
import VideoTimeline from "@/components/clips/VideoTimeline";
import ClipPreviewModal from "@/components/clips/ClipPreviewModal";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clip, ProcessingStatus } from "@/types/clip";
import { generateMockClips } from "@/utils/clipDetection";

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("idle");
  const [clips, setClips] = useState<Clip[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [previewClip, setPreviewClip] = useState<Clip | null>(null);
  
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [uploadedFile]);

  const handleUploadComplete = (file: File) => {
    setUploadedFile(file);
  };

  const handleVideoLoaded = useCallback((duration: number) => {
    setVideoDuration(duration);
  }, []);

  const handleStartProcessing = () => {
    setProcessingStatus("processing");
  };

  const handleProcessingComplete = useCallback(() => {
    // Generate mock clips based on video duration
    const duration = videoDuration || 180; // Default 3 minutes if unknown
    const detectedClips = generateMockClips(duration);
    setClips(detectedClips);
    setProcessingStatus("complete");
  }, [videoDuration]);

  const handleReset = () => {
    setUploadedFile(null);
    setVideoUrl("");
    setVideoDuration(0);
    setProcessingStatus("idle");
    setClips([]);
    setCurrentTime(0);
    setPreviewClip(null);
  };

  const handleSelectClip = (id: string) => {
    setClips(prev => prev.map(clip => 
      clip.id === id ? { ...clip, selected: !clip.selected } : clip
    ));
  };

  const handlePreviewClip = (clip: Clip) => {
    setPreviewClip(clip);
  };

  const handleClosePreview = () => {
    setPreviewClip(null);
  };

  const handleSaveClip = (updatedClip: Clip) => {
    setClips(prev => prev.map(clip => 
      clip.id === updatedClip.id ? updatedClip : clip
    ));
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = time;
    }
  };

  const handleTimelineClipClick = (clip: Clip) => {
    handleSeek(clip.startTime);
    handleSelectClip(clip.id);
  };

  const handleAddCustomClip = (startTime: number, endTime: number) => {
    const newClip: Clip = {
      id: `custom-${Date.now()}`,
      startTime,
      endTime,
      title: "Custom Selection",
      score: Math.floor(Math.random() * 30 + 50),
      selected: true,
    };
    setClips(prev => [...prev, newClip].sort((a, b) => a.startTime - b.startTime));
  };

  const handleFindMoreClips = () => {
    // Generate additional clips
    const additionalClips = generateMockClips(videoDuration)
      .filter(newClip => !clips.some(existing => 
        Math.abs(existing.startTime - newClip.startTime) < 10
      ))
      .slice(0, 3)
      .map(clip => ({ ...clip, id: `clip-${Date.now()}-${Math.random()}` }));
    
    setClips(prev => [...prev, ...additionalClips].sort((a, b) => a.startTime - b.startTime));
  };

  const selectedClipsCount = clips.filter(c => c.selected).length;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Stage 1: Upload */}
            {!uploadedFile && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Upload Your <span className="gradient-text">Video</span>
                  </h1>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Drop your long-form content here and we'll help you find the best moments to repurpose into viral shorts.
                  </p>
                </div>
                <VideoUploadZone onUploadComplete={handleUploadComplete} />
              </motion.div>
            )}

            {/* Stage 2: Preview before processing */}
            {uploadedFile && processingStatus === "idle" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Ready to Analyze</h1>
                  <p className="text-muted-foreground">
                    Preview your video and start the AI analysis when ready
                  </p>
                </div>
                
                <VideoPreview 
                  file={uploadedFile} 
                  onDurationLoaded={handleVideoLoaded}
                />
                
                <div className="text-center mt-8 flex items-center justify-center gap-4">
                  <Button variant="hero" size="lg" onClick={handleStartProcessing}>
                    Start AI Analysis
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleReset}>
                    Upload Different Video
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Stage 3: Processing */}
            {processingStatus === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProcessingScreen onComplete={handleProcessingComplete} />
              </motion.div>
            )}

            {/* Stage 4: Results */}
            {processingStatus === "complete" && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      <span className="gradient-text">AI Analysis Complete</span>
                    </h1>
                    <p className="text-muted-foreground">
                      Found {clips.length} potential clips • {selectedClipsCount} selected
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleReset}>
                      Upload New Video
                    </Button>
                    <Button 
                      variant="hero" 
                      disabled={selectedClipsCount === 0}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export {selectedClipsCount} Clip{selectedClipsCount !== 1 ? "s" : ""}
                    </Button>
                  </div>
                </div>

                {/* Hidden video element for seeking */}
                <video
                  ref={mainVideoRef}
                  src={videoUrl}
                  className="hidden"
                  onTimeUpdate={() => {
                    if (mainVideoRef.current) {
                      setCurrentTime(mainVideoRef.current.currentTime);
                    }
                  }}
                />

                {/* Timeline */}
                <VideoTimeline
                  duration={videoDuration || 180}
                  currentTime={currentTime}
                  clips={clips}
                  onSeek={handleSeek}
                  onClipClick={handleTimelineClipClick}
                  onAddCustomClip={handleAddCustomClip}
                />

                {/* Clip Grid */}
                <ClipResultsGrid
                  clips={clips}
                  onSelectClip={handleSelectClip}
                  onPreviewClip={handlePreviewClip}
                  onFindMore={handleFindMoreClips}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clip Preview Modal */}
          <AnimatePresence>
            {previewClip && (
              <ClipPreviewModal
                clip={previewClip}
                videoUrl={videoUrl}
                onClose={handleClosePreview}
                onSave={handleSaveClip}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Upload;
