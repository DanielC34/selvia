import { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background-obsidian flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Absolute center diamond design for brand core */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center">
          {/* Logo representation - Rotated Outer White Diamond with Glow */}
          <div className="absolute w-24 h-24 border border-white/20 transform rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.02)]">
            {/* Inner elegant diamond */}
            <div className="w-16 h-16 bg-white/5 transform flex items-center justify-center border border-white/10">
              {/* Center pure white dot seed representation */}
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Main Logo Image Layer with ambient breathing animation */}
          <motion.img
            src="https://lh3.googleusercontent.com/aida/AP1WRLv87mDGRM7YejGlnKg2eQaBHkG1trBDsJWyFIUidk5gDQczGy7VYuyJntx684BarZnlfHjHkRlLkjykyANv5vKXhanxSstU2Qts9xbv1wJeSJGoJXvTlvUcVSihGWIoBG_vKtU0TXl-aCitwk7cNO2Z1m3cm2mVsW3lR-UiE9YIN7y2TYaKqc1Oq7aF74x5ewiobf0Z7y7uUn35M2TpfSmWQofp4hGpkfdAg5Rk_mvhTivp4h1Qc73e9b6K"
            alt="Selvia Logo"
            className="absolute w-32 h-32 md:w-44 md:h-44 object-contain rounded-lg z-10 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            referrerPolicy="no-referrer"
            animate={{
              filter: [
                'drop-shadow(0 0 10px rgba(255, 255, 255, 0.05))',
                'drop-shadow(0 0 25px rgba(255, 255, 255, 0.15))',
                'drop-shadow(0 0 10px rgba(255, 255, 255, 0.05))'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Pure minimalist loading progress bar */}
        <div className="w-32 h-[1px] bg-neutral-900 rounded-full mt-8 overflow-hidden relative">
          <motion.div
            className="absolute left-0 top-0 h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
