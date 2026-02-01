import { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/layout/Header";
import VideoUploadZone from "@/components/upload/VideoUploadZone";
import VideoPreview from "@/components/upload/VideoPreview";
import ProcessingScreen from "@/components/processing/ProcessingScreen";
import ClipResults from "@/components/clips/ClipResults";
import ClipPreviewModal from "@/components/clips/ClipPreviewModal";
import VideoTimeline from "@/components/timeline/VideoTimeline";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clip, AppStage } from "@/types/clip";
import { generateClips, extractThumbnail } from "@/utils/clipUtils";
import { toast } from "sonner";

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [stage, setStage] = useState<AppStage>("upload");
  const [clips, setClips] = useState<Clip[]>([]);
  const [previewClip, setPreviewClip] = useState<Clip | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleUploadComplete = (file: File) => {
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleReset = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setUploadedFile(null);
    setVideoUrl("");
    setVideoDuration(0);
    setCurrentTime(0);
    setStage("upload");
    setClips([]);
    setPreviewClip(null);
  };

  const handleStartProcessing = () => {
    setStage("processing");
  };

  const handleProcessingComplete = useCallback(async () => {
    // Generate simulated clips
    const generatedClips = generateClips(videoDuration, 6);
    
    // Try to extract thumbnails
    if (videoRef.current) {
      const clipsWithThumbnails = await Promise.all(
        generatedClips.map(async (clip) => {
          try {
            const thumbnail = await extractThumbnail(
              videoRef.current!,
              clip.startTime + (clip.endTime - clip.startTime) / 2
            );
            return { ...clip, thumbnail };
          } catch {
            return clip;
          }
        })
      );
      setClips(clipsWithThumbnails);
    } else {
      setClips(generatedClips);
    }
    
    setStage("results");
    toast.success("Analysis complete! Found 6 potential clips.");
  }, [videoDuration]);

  const handleVideoLoaded = (duration: number, ref: HTMLVideoElement) => {
    setVideoDuration(duration);
    videoRef.current = ref;
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSelectClip = (id: string) => {
    setClips((prev) =>
      prev.map((clip) =>
        clip.id === id ? { ...clip, selected: !clip.selected } : clip
      )
    );
  };

  const handlePreviewClip = (clip: Clip) => {
    setPreviewClip(clip);
  };

  const handleSaveClip = (updatedClip: Clip) => {
    setClips((prev) =>
      prev.map((clip) => (clip.id === updatedClip.id ? updatedClip : clip))
    );
    setPreviewClip(null);
    toast.success("Clip updated!");
  };

  const handleFindMore = () => {
    const newClips = generateClips(videoDuration, 3);
    const renamedClips = newClips.map((clip, i) => ({
      ...clip,
      id: `clip-new-${Date.now()}-${i}`,
      title: `${clip.title.replace(/#\d+/, "")} #${clips.length + i + 1}`,
    }));
    setClips((prev) => [...prev, ...renamedClips].sort((a, b) => a.startTime - b.startTime));
    toast.success("Found 3 more clips!");
  };

  const handleCreateCustomClip = (startTime: number, endTime: number) => {
    const newClip: Clip = {
      id: `custom-${Date.now()}`,
      startTime,
      endTime,
      title: `Custom Clip #${clips.length + 1}`,
      score: 75,
      selected: true,
    };
    setClips((prev) => [...prev, newClip].sort((a, b) => a.startTime - b.startTime));
    toast.success("Custom clip created!");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            {stage !== "upload" && (
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>
            )}
          </motion.div>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {stage === "upload" && (
                <>Upload Your <span className="gradient-text">Video</span></>
              )}
              {stage === "processing" && (
                <>Analyzing <span className="gradient-text">Content</span></>
              )}
              {stage === "results" && (
                <>Your <span className="gradient-text">Clips</span> Are Ready</>
              )}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {stage === "upload" &&
                "Drop your long-form content here and we'll help you find the best moments to repurpose into viral shorts."}
              {stage === "processing" &&
                "Our AI is scanning your video for the most engaging moments..."}
              {stage === "results" &&
                "Review and customize your clips before exporting them for social media."}
            </p>
          </motion.div>

          {/* Content based on stage */}
          <AnimatePresence mode="wait">
            {stage === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {uploadedFile ? (
                  <div>
                    <VideoPreview
                      file={uploadedFile}
                      onVideoLoaded={handleVideoLoaded}
                      onTimeUpdate={handleTimeUpdate}
                    />
                    <div className="text-center mt-8">
                      <Button variant="hero" size="lg" className="mr-4" onClick={handleStartProcessing}>
                        Start Processing
                      </Button>
                      <Button variant="outline" size="lg" onClick={handleReset}>
                        Upload Different Video
                      </Button>
                    </div>
                  </div>
                ) : (
                  <VideoUploadZone onUploadComplete={handleUploadComplete} />
                )}
              </motion.div>
            )}

            {stage === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProcessingScreen onComplete={handleProcessingComplete} />
                {/* Hidden video for thumbnail extraction */}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="hidden"
                  preload="metadata"
                />
              </motion.div>
            )}

            {stage === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Timeline */}
                <VideoTimeline
                  duration={videoDuration}
                  currentTime={currentTime}
                  clips={clips}
                  onSeek={handleSeek}
                  onClipCreate={handleCreateCustomClip}
                />

                {/* Clip results */}
                <ClipResults
                  clips={clips}
                  onSelectClip={handleSelectClip}
                  onPreviewClip={handlePreviewClip}
                  onFindMore={handleFindMore}
                />

                {/* Preview modal */}
                <ClipPreviewModal
                  clip={previewClip}
                  videoUrl={videoUrl}
                  onClose={() => setPreviewClip(null)}
                  onSave={handleSaveClip}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Upload;
