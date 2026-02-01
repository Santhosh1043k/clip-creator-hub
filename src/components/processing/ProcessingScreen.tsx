import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Scissors, Wand2, CheckCircle2 } from "lucide-react";
import { ProcessingStep } from "@/types/clip";

interface ProcessingScreenProps {
  onComplete: () => void;
}

const processingSteps: ProcessingStep[] = [
  { id: "analyze", label: "Analyzing video content", status: "pending" },
  { id: "detect", label: "Detecting highlights", status: "pending" },
  { id: "moments", label: "Finding best moments", status: "pending" },
  { id: "generate", label: "Generating clips", status: "pending" },
];

const stepIcons = {
  analyze: Eye,
  detect: Sparkles,
  moments: Wand2,
  generate: Scissors,
};

const ProcessingScreen = ({ onComplete }: ProcessingScreenProps) => {
  const [steps, setSteps] = useState<ProcessingStep[]>(processingSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const processStep = (index: number) => {
      if (index >= steps.length) {
        // All steps complete, wait a moment then call onComplete
        setTimeout(onComplete, 500);
        return;
      }

      // Mark current step as processing
      setSteps(prev => prev.map((step, i) => ({
        ...step,
        status: i === index ? "processing" : i < index ? "complete" : "pending"
      })));
      setCurrentStepIndex(index);

      // Complete this step after a random delay (800-1200ms)
      const delay = Math.random() * 400 + 800;
      setTimeout(() => {
        setSteps(prev => prev.map((step, i) => ({
          ...step,
          status: i <= index ? "complete" : "pending"
        })));
        // Move to next step
        setTimeout(() => processStep(index + 1), 200);
      }, delay);
    };

    // Start processing after initial delay
    const timer = setTimeout(() => processStep(0), 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto"
    >
      {/* Animated AI icon */}
      <motion.div
        className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center relative"
        animate={{
          boxShadow: [
            "0 0 20px hsla(260, 85%, 60%, 0.3)",
            "0 0 40px hsla(260, 85%, 60%, 0.5)",
            "0 0 20px hsla(260, 85%, 60%, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Wand2 className="w-12 h-12 text-primary" />
        </motion.div>
        
        {/* Orbiting particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1,
            }}
            style={{
              transformOrigin: "48px 48px",
            }}
          />
        ))}
      </motion.div>

      <motion.h2
        className="text-2xl font-bold mb-2"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Analyzing Your Video...
      </motion.h2>
      <p className="text-muted-foreground mb-8">
        Our AI is finding the best moments for viral shorts
      </p>

      {/* Processing steps */}
      <div className="space-y-4 text-left">
        {steps.map((step, index) => {
          const Icon = stepIcons[step.id as keyof typeof stepIcons];
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors duration-300 ${
                step.status === "processing" ? "bg-primary/10" : 
                step.status === "complete" ? "bg-primary/5" : "opacity-50"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                step.status === "complete" ? "bg-primary/20" :
                step.status === "processing" ? "bg-primary/30" : "bg-muted"
              }`}>
                <AnimatePresence mode="wait">
                  {step.status === "complete" ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </motion.div>
                  ) : step.status === "processing" ? (
                    <motion.div
                      key="processing"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon className="w-5 h-5 text-primary" />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </AnimatePresence>
              </div>
              
              <span className={`font-medium transition-colors duration-300 ${
                step.status === "complete" ? "text-foreground" :
                step.status === "processing" ? "text-primary" : "text-muted-foreground"
              }`}>
                {step.label}
              </span>
              
              {step.status === "processing" && (
                <motion.div
                  className="ml-auto flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProcessingScreen;
