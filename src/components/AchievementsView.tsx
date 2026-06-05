import { motion } from 'motion/react';
import { 
  Compass, 
  Dumbbell, 
  BookOpen, 
  Target, 
  Flame, 
  Lock, 
  Unlock, 
  Check, 
  Award 
} from 'lucide-react';
import { UserProfile } from '../types';

interface AchievementsViewProps {
  userProfile: UserProfile;
}

export default function AchievementsView({ userProfile }: AchievementsViewProps) {
  
  // Custom definitions for Achievements with matching logic based on state
  const achievementsList = [
    {
      id: 'ach-7day',
      name: 'Architect',
      subtext: '7-day streak',
      icon: <Compass className="w-6 h-6" />,
      checkValue: userProfile.streak >= 7,
      descriptor: 'Fulfilling commitments consistently for a full weekly loop.'
    },
    {
      id: 'ach-30workout',
      name: 'Endurance',
      subtext: '30 workouts',
      icon: <Dumbbell className="w-6 h-6" />,
      // unlocked if level >= 24 (demo account) or physical XP is high
      checkValue: userProfile.level >= 24 || (userProfile.categoryXp?.physical || 0) >= 3000,
      descriptor: 'Consistent physical sessions recorded.'
    },
    {
      id: 'ach-100session',
      name: 'Scholar',
      subtext: '100 sessions',
      icon: <BookOpen className="w-6 h-6" />,
      // unlocked if level >= 24 or reading XP is high
      checkValue: userProfile.level >= 24 || (userProfile.categoryXp?.reading || 0) >= 2800,
      descriptor: 'Consistent reading sessions recorded.'
    },
    {
      id: 'ach-zenith',
      name: 'Zenith',
      subtext: 'Lvl 100 Reached',
      icon: <Target className="w-6 h-6" />,
      checkValue: userProfile.level >= 100,
      descriptor: 'Long-term consistency recorded.'
    },
    {
      id: 'ach-ascendant',
      name: 'Ascendant',
      subtext: '365-day streak',
      icon: <Flame className="w-6 h-6" />,
      checkValue: userProfile.streak >= 365,
      descriptor: 'Maintained consistency for 365 days.'
    }
  ];

  return (
    <div className="space-y-8 pb-12 select-none">
      
      {/* Header descriptors */}
      <section className="space-y-1 mt-4">
        <h2 className="font-serif italic font-light text-2xl text-white tracking-wide">
          Milestones
        </h2>
        <p className="text-xs text-[#888] uppercase tracking-wider">
          Consistency records.
        </p>
      </section>

      {/* Grid of achievement cards */}
      <section className="grid grid-cols-2 gap-4">
        {achievementsList.map((ach, index) => {
          const isUnlocked = ach.checkValue;

          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={ach.id}
              className={`p-6 rounded-lg border text-center flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group shadow-[0_4px_16px_rgba(0,0,0,0.8)] ${
                isUnlocked 
                  ? 'border-white/10 bg-[#0A0A0A] hover:bg-[#0E0E0E]' 
                  : 'border-[#151515] bg-[#070707] opacity-40'
              }`}
              style={{ minHeight: '190px' }}
            >
              
              {/* Floating check overlay to indicate unlocked state */}
              {isUnlocked && (
                <div className="absolute top-3 right-3 bg-white/5 border border-white/10 rounded-full p-0.5 text-white">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}

              {/* Master Medal Ring */}
              <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-6 transition-all duration-300 ${
                isUnlocked 
                  ? 'border-emerald-500/20 bg-emerald-950/10 text-emerald-400 group-hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'border-[#1E1E1E] bg-black text-[#444]'
              }`}>
                {isUnlocked ? ach.icon : <Lock className="w-5 h-5" />}
              </div>

              {/* Badge name */}
              <h3 className={`text-base font-semibold tracking-wide font-sans ${
                isUnlocked ? 'text-white' : 'text-[#555]'
              }`}>
                {ach.name}
              </h3>

              {/* Badge subtext */}
              <span className={`text-[10px] font-mono uppercase tracking-[0.2em] mt-1 bg-transparent block ${
                isUnlocked ? 'text-[#888]' : 'text-[#444]'
              }`}>
                {ach.subtext}
              </span>

              {/* Description reveal hover block on desktop */}
              <div className="absolute inset-0 bg-[#0A0A0A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 flex flex-col items-center justify-center text-center select-none pointer-events-none border border-white/5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold block mb-1">
                  {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
                <p className="text-[11px] text-[#BBB] leading-relaxed font-sans px-1">
                  {ach.descriptor}
                </p>
              </div>

            </motion.div>
          );
        })}
      </section>

      {/* Rarity & Completion Status message */}
      <section className="bg-[#0A0A0A] border border-[#141414] p-5 rounded-lg text-center shadow-lg">
        <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-[#555] font-semibold">Status</span>
        <h4 className="font-serif italic font-light text-sm text-white/95 mt-1.5 leading-relaxed">
          {achievementsList.filter(a => a.checkValue).length} out of {achievementsList.length} milestones unlocked
        </h4>
        <p className="text-[9px] uppercase tracking-wider text-[#666] mt-0.5">
          Milestones reflect continuous consistency recorded by the system.
        </p>
      </section>

    </div>
  );
}
