import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Scissors, CheckCircle2, Loader2 } from "lucide-react";
import { ProcessingStep } from "@/types/clip";
import { Progress } from "@/components/ui/progress";

interface ProcessingScreenProps {
  onComplete: () => void;
}

const processingSteps: ProcessingStep[] = [
  { id: "highlights", label: "Detecting highlights", status: "pending" },
  { id: "moments", label: "Finding best moments", status: "pending" },
  { id: "clips", label: "Generating clips", status: "pending" },
];

const ProcessingScreen = ({ onComplete }: ProcessingScreenProps) => {
  const [steps, setSteps] = useState<ProcessingStep[]>(processingSteps);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const totalDuration = 4000; // 4 seconds total
    const stepDuration = totalDuration / steps.length;
    const progressInterval = 50;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (totalDuration / progressInterval));
        return Math.min(next, 100);
      });
    }, progressInterval);

    steps.forEach((_, index) => {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => ({
            ...step,
            status: i < index ? "complete" : i === index ? "processing" : "pending",
          }))
        );
        setCurrentStepIndex(index);
      }, index * stepDuration);

      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => ({
            ...step,
            status: i <= index ? "complete" : "pending",
          }))
        );
      }, (index + 1) * stepDuration - 100);
    });

    const completeTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 500);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, steps.length]);

  const getStepIcon = (step: ProcessingStep, index: number) => {
    const icons = [Search, Sparkles, Scissors];
    const IconComponent = icons[index];

    if (step.status === "complete") {
      return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    }
    if (step.status === "processing") {
      return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    }
    return <IconComponent className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-lg mx-auto py-12"
    >
      <div className="glass-card rounded-2xl p-8 text-center">
        {/* Animated logo */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">Analyzing Your Video</h2>
        <p className="text-muted-foreground mb-8">
          Our AI is finding the best moments to repurpose
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Processing steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: currentStepIndex === index ? 1.02 : 1,
              }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                step.status === "processing"
                  ? "bg-primary/10 border border-primary/30"
                  : step.status === "complete"
                  ? "bg-green-500/10"
                  : "bg-muted/30"
              }`}
            >
              {getStepIcon(step, index)}
              <span
                className={`text-sm font-medium ${
                  step.status === "processing"
                    ? "text-foreground"
                    : step.status === "complete"
                    ? "text-green-400"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              <AnimatePresence>
                {step.status === "complete" && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="ml-auto text-xs text-green-400"
                  >
                    Done
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-1 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessingScreen;
