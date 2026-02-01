import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Download, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import EditorVideoPreview from "@/components/editor/EditorVideoPreview";
import CaptionsTab from "@/components/editor/CaptionsTab";
import TitleTab from "@/components/editor/TitleTab";
import VisualTab from "@/components/editor/VisualTab";
import PlatformTab from "@/components/editor/PlatformTab";
import { ClipEdits, defaultClipEdits } from "@/types/clipEditor";
import { toast } from "sonner";
import { MessageSquare, Type, Palette, Share2 } from "lucide-react";

const ClipEditor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get clip data from URL params (in real app, would fetch from state/API)
  const videoUrl = searchParams.get("video") || "";
  const startTime = parseFloat(searchParams.get("start") || "0");
  const endTime = parseFloat(searchParams.get("end") || "60");
  const clipTitle = searchParams.get("title") || "Untitled Clip";

  const [edits, setEdits] = useState<ClipEdits>(() => ({
    ...defaultClipEdits,
    title: {
      ...defaultClipEdits.title,
      text: clipTitle,
    },
  }));

  const [currentTime, setCurrentTime] = useState(0);
  const clipDuration = endTime - startTime;

  // Redirect if no video URL
  useEffect(() => {
    if (!videoUrl) {
      toast.error("No video selected");
      navigate("/upload");
    }
  }, [videoUrl, navigate]);

  const handleSaveExport = () => {
    toast.success("Clip saved! Export feature coming soon.");
  };

  const handlePreviewFull = () => {
    toast.info("Full preview mode coming soon!");
  };

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-4 px-4 flex flex-col">
        <div className="container mx-auto max-w-7xl flex-1 flex flex-col">
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Clips
            </Button>
            <h1 className="text-lg font-semibold">
              Editing: <span className="gradient-text">{clipTitle}</span>
            </h1>
            <div className="w-32" /> {/* Spacer for alignment */}
          </motion.div>

          {/* Main Editor Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-h-0"
          >
            <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-border/50">
              {/* Left Side - Video Preview */}
              <ResizablePanel defaultSize={55} minSize={40}>
                <div className="h-full p-4 bg-background/50">
                  <EditorVideoPreview
                    videoUrl={videoUrl}
                    startTime={startTime}
                    endTime={endTime}
                    edits={edits}
                    onTimeUpdate={setCurrentTime}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Right Side - Editing Panel */}
              <ResizablePanel defaultSize={45} minSize={30}>
                <div className="h-full overflow-hidden flex flex-col bg-muted/30">
                  <Tabs defaultValue="captions" className="flex-1 flex flex-col">
                    <div className="p-4 pb-0">
                      <TabsList className="w-full grid grid-cols-4">
                        <TabsTrigger value="captions" className="gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Captions</span>
                        </TabsTrigger>
                        <TabsTrigger value="title" className="gap-1.5">
                          <Type className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Title</span>
                        </TabsTrigger>
                        <TabsTrigger value="visual" className="gap-1.5">
                          <Palette className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Visual</span>
                        </TabsTrigger>
                        <TabsTrigger value="platform" className="gap-1.5">
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Platform</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <TabsContent value="captions" className="mt-0 h-full">
                        <CaptionsTab
                          settings={edits.captions}
                          onChange={(captions) => setEdits({ ...edits, captions })}
                        />
                      </TabsContent>
                      <TabsContent value="title" className="mt-0 h-full">
                        <TitleTab
                          settings={edits.title}
                          onChange={(title) => setEdits({ ...edits, title })}
                          clipTitle={clipTitle}
                        />
                      </TabsContent>
                      <TabsContent value="visual" className="mt-0 h-full">
                        <VisualTab
                          settings={edits.visual}
                          onChange={(visual) => setEdits({ ...edits, visual })}
                          currentTime={currentTime}
                          clipDuration={clipDuration}
                        />
                      </TabsContent>
                      <TabsContent value="platform" className="mt-0 h-full">
                        <PlatformTab
                          settings={edits.platform}
                          onChange={(platform) => setEdits({ ...edits, platform })}
                          clipDuration={clipDuration}
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </motion.div>

          {/* Bottom Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center justify-between p-4 glass-card rounded-lg"
          >
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Clips
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handlePreviewFull} className="gap-2">
                <Eye className="w-4 h-4" />
                Preview Full Clip
              </Button>
              <Button variant="hero" onClick={handleSaveExport} className="gap-2">
                <Download className="w-4 h-4" />
                Save & Export
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ClipEditor;
