import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const [isComplete, setIsComplete] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (progress >= 100) {
      setIsComplete(true);
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(false);
      setAnimationKey(prev => prev + 1);
    }
  }, [progress]);

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${Math.min(Math.max(progress, 0), 100)}%`,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0, 0.5, 0],
      transition: {
        duration: 1.5,
        repeat: 2,
        ease: "easeInOut"
      }
    }
  };

  const loadingSpinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const statusMessageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="relative space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="text-emerald-500"
              >
                <CheckCircle size={16} />
              </motion.div>
            ) : progress > 0 ? (
              <motion.div
                key="loading"
                variants={loadingSpinnerVariants}
                animate="animate"
                className="text-teal-500"
              >
                <Loader2 size={16} />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <span className="text-sm font-medium text-gray-700">
            {isComplete ? 'Processing Complete' : 'Processing Image...'}
          </span>
        </div>
        <motion.span 
          key={animationKey}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-teal-600"
        >
          {Math.round(progress)}%
        </motion.span>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-full" />
        
        <div 
          ref={progressBarRef}
          className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner"
        >
          <motion.div 
            key={`progress-${animationKey}`}
            variants={progressVariants}
            initial="initial"
            animate="animate"
            className={`h-full relative ${
              isComplete 
                ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500' 
                : 'bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500'
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%)] bg-[length:20px_20px] animate-[progress_1s_linear_infinite]" />
            
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["0%", "100%"],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {!isComplete && (
              <motion.div 
                className="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {showPulse && (
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-teal-400/30 rounded-full"
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {progress > 0 && (
          <motion.div
            key={`status-${progress < 50 ? 'loading' : progress < 100 ? 'analyzing' : 'complete'}`}
            variants={statusMessageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center space-x-2 mt-2"
          >
            {progress < 50 ? (
              <>
                <AlertCircle size={14} className="text-blue-500" />
                <span className="text-xs text-blue-600">Loading language data...</span>
              </>
            ) : progress < 100 ? (
              <>
                <AlertCircle size={14} className="text-teal-500" />
                <span className="text-xs text-teal-600">Analyzing image content...</span>
              </>
            ) : (
              <>
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-xs text-emerald-600">Processing complete!</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressBar;