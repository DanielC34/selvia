import { motion } from 'motion/react';
import { ArrowRight, Compass } from 'lucide-react';

interface WelcomeProps {
  onBegin: () => void;
  onNavigateLogin: () => void;
}

export default function Welcome({ onBegin, onNavigateLogin }: WelcomeProps) {
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
    onBegin();
  };

  return (
    <div className="min-h-screen text-on-background flex flex-col items-center justify-center relative overflow-hidden bg-background-obsidian font-sans p-6">
      {/* Ambient glowing background orb */}
      <div className="ambient-glow"></div>

      <motion.main
        className="w-full max-w-xl z-10 flex flex-col items-center justify-center min-h-[85vh]"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Welcome Glass Card */}
        <div className="glass-panel rounded-2xl p-8 md:p-12 w-full flex flex-col items-center text-center space-y-8 animate-fade-in-up">
          
          {/* Brand Mark Circle container with subtle glowing shadow */}
          <motion.div
            className="w-12 h-12 rounded-full border border-[#1A1A1A] flex items-center justify-center bg-[#080808] shadow-[0_0_10px_rgba(255,255,255,0.02)]"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Compass className="text-white w-5 h-5 select-none" />
          </motion.div>

          {/* Core Branding Typography */}
          <div className="space-y-4 w-full">
            <h1 className="font-display font-light text-5xl tracking-[0.2em] text-white uppercase">
              SELVIA
            </h1>
            
            <p className="font-display font-light italic text-2xl md:text-3xl text-white leading-tight tracking-tight">
              Consistency over time.
            </p>
            
            <p className="font-sans text-sm text-[#888] leading-relaxed max-w-md mx-auto pt-2">
              A quiet tool to track daily decisions. No noise, no praise. Just structured, repeating commitments that reflect your discipline back to you.
            </p>
          </div>

          {/* Main call to actions */}
          <div className="w-full max-w-xs space-y-4 pt-4">
            <button
              onClick={triggerHaptic}
              className="w-full bg-white text-black font-headline font-bold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-none hover:bg-neutral-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              Enter
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateLogin}
              className="text-[10px] font-headline uppercase tracking-[0.2em] text-[#666] hover:text-white transition-colors duration-200 block mx-auto mt-4 cursor-pointer"
            >
              Resume identity
            </button>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
