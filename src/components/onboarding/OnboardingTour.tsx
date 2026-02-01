import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Scissors, Download, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingTourProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Upload,
    title: "Upload Your Video",
    description: "Start by uploading any long-form video. We support MP4, MOV, and more.",
    color: "from-primary to-primary/60",
  },
  {
    icon: Sparkles,
    title: "AI Detects Best Moments",
    description: "Our AI analyzes your video and finds the most engaging clips automatically.",
    color: "from-secondary to-secondary/60",
  },
  {
    icon: Scissors,
    title: "Edit & Customize",
    description: "Add captions, titles, and visual effects. Optimize for any platform.",
    color: "from-accent to-accent/60",
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Download your clips and share directly to TikTok, Reels, and Shorts.",
    color: "from-primary to-secondary",
  },
];

const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleGetStarted = () => {
    handleComplete();
    navigate("/upload");
  };

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-6 bg-primary"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                >
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                {/* Text */}
                <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleSkip}>
                Skip tour
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button variant="hero" onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button variant="hero" onClick={handleGetStarted}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
