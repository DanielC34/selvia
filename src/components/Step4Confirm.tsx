import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface Step4Props {
  onBack: () => void;
  onEnter: () => void;
}

export default function Step4Confirm({ onBack, onEnter }: Step4Props) {
  const triggerHapticAndEnter = () => {
    if (navigator.vibrate) {
      navigator.vibrate([60, 40, 60]);
    }
    onEnter();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-sans relative overflow-hidden p-6 md:p-8 justify-center select-none">
      
      {/* Main Box */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center relative z-10 px-4">
        {/* Step Indicator */}
        <span className="font-mono text-[10px] text-[#666] uppercase tracking-[0.25em] mb-4">Step 04 of 04</span>

        {/* Minimal Shield/Lock Stamp representing sealed commitments */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(255,255,255,0.02)]"
        >
          <ShieldCheck className="w-8 h-8 text-white/80" />
        </motion.div>

        {/* Bold typography matching final screen */}
        <motion.h2
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl text-white font-light leading-snug tracking-tight mb-6 italic"
        >
          "The commitments are recorded."
        </motion.h2>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-xs sm:text-sm text-[#888] tracking-wide max-w-sm mb-12"
        >
          Your daily commitments are saved. You can begin tracking daily consistency.
        </motion.p>

        {/* Buttons layout */}
        <div className="flex flex-col gap-4 w-full max-w-xs justify-center items-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={triggerHapticAndEnter}
            className="w-full bg-white text-black font-headline font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-none hover:bg-neutral-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Complete</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <button
            onClick={onBack}
            className="text-[10px] uppercase tracking-[0.2em] text-[#666] hover:text-white transition-colors cursor-pointer mt-4 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Refine commitments</span>
          </button>
        </div>
      </div>
    </div>
  );
}
