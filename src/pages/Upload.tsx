import { useState } from "react";
import Header from "@/components/layout/Header";
import VideoUploadZone from "@/components/upload/VideoUploadZone";
import VideoPreview from "@/components/upload/VideoPreview";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleUploadComplete = (file: File) => {
    setUploadedFile(file);
  };

  const handleReset = () => {
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
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

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Upload Your <span className="gradient-text">Video</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Drop your long-form content here and we'll help you find the best moments to repurpose into viral shorts.
            </p>
          </motion.div>

          {/* Upload area or Preview */}
          {uploadedFile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <VideoPreview file={uploadedFile} />
              <div className="text-center mt-8">
                <Button variant="hero" size="lg" className="mr-4">
                  Start Processing
                </Button>
                <Button variant="outline" size="lg" onClick={handleReset}>
                  Upload Different Video
                </Button>
              </div>
            </motion.div>
          ) : (
            <VideoUploadZone onUploadComplete={handleUploadComplete} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Upload;
