import { motion } from 'motion/react';
import { 
  User, 
  Award, 
  Flame, 
  ShieldAlert, 
  Target, 
  Activity, 
  BookOpen, 
  Briefcase, 
  Sparkles,
  Zap
} from 'lucide-react';
import { UserProfile } from '../types';

interface CharacterViewProps {
  userProfile: UserProfile;
}

export default function CharacterView({ userProfile }: CharacterViewProps) {
  // Compute dynamic discipline alignment score (matches 74 for level 24)
  const disciplineScore = Math.min(100, Math.floor(userProfile.level * 3) + 2);
  
  // Custom identity statements
  const statements = [
    "Routines form the framework of daily action.",
    "Repeated actions define focus over time.",
    "Quiet discipline produces quiet outcomes."
  ];

  // Helper to safely format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Pillars XP to percentage tracking (Level 1-100 bars)
  const getPillarProgress = (val: number) => {
    // category level is computed from catXp. e.g. lvl 32 is roughly 32% if max lvl is 100
    return Math.min(100, Math.max(10, val));
  };

  const formattedArchetype = (id: string, text?: string) => {
    if (id === 'custom' && text) return text;
    return id
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      
      {/* Top Silhouette Portrait block */}
      <section className="flex flex-col items-center text-center mt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/10 to-[#0A0A0A] border border-white/15 p-1 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
              <User className="w-10 h-10 text-white/50 stroke-[1.5]" />
            </div>
          </div>
          {/* Subtle crown or floating spark */}
          <div className="absolute -top-1.5 -right-1 bg-white border border-black p-1 rounded-full shadow-lg">
            <Target className="w-3.5 h-3.5 text-black" />
          </div>
        </div>

        <h2 className="font-serif italic font-light text-2xl text-white mt-4 tracking-wide">
          Character
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#666] mt-0.5 font-semibold">
          {formattedArchetype(userProfile.archetypeId, userProfile.customArchetypeText)}
        </span>
      </section>

      {/* Large visual Discipline Circle representation */}
      <section className="flex justify-center my-6">
        <div className="w-56 h-56 rounded-full border border-white/5 bg-[#080808] flex flex-col items-center justify-center relative shadow-[inset_0_4px_30px_rgba(255,255,255,0.01),0_8px_32px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Internal compass rotation indicator line */}
          <div className="absolute inset-2 border border-white/[0.02] rounded-full" />
          
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#444] font-semibold mb-1">
            Consistency Level
          </span>
          <span className="font-serif text-6xl text-white font-light tracking-tight leading-none">
            {disciplineScore}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-white/60 mt-3 flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 uppercase">
            📈 Top 12%
          </span>
        </div>
      </section>

      {/* Dual Stats columns */}
      <section className="grid grid-cols-2 gap-4">
        
        {/* Statistics Pillar: Lifetime XP tracker */}
        <div className="bg-[#0A0A0A] border border-[#141414] rounded-lg p-5 flex flex-col text-left shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#AAA]" />
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#555] font-semibold">
              Total Progress
            </span>
          </div>
          <span className="font-sans text-2xl font-semibold text-white tracking-wide mt-3 block">
            {formatNumber(userProfile.lifetimeXp)}
          </span>
          <span className="text-[9px] font-mono uppercase text-[#666] mt-1.5 tracking-wider block">
            +{formatNumber(Math.floor(userProfile.lifetimeXp / 100))} this week
          </span>
        </div>

        {/* Statistics Pillar: Streaks counters */}
        <div className="bg-[#0A0A0A] border border-[#141414] rounded-lg p-5 flex flex-col text-left shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#AAA]" />
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#555] font-semibold">
              Current Streak
            </span>
          </div>
          <span className="font-sans text-2xl font-semibold text-white tracking-wide mt-3 block">
            {userProfile.streak} Days
          </span>
          <span className="text-[9px] font-mono uppercase text-[#666] mt-1.5 tracking-wider block">
            Best: {Math.max(userProfile.streak, 68)} Days
          </span>
        </div>

      </section>

      {/* Identity Progression Statement cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-[#141414]">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#555] font-semibold">
            🤚 Identity Focus
          </span>
        </div>

        <div className="space-y-2.5">
          {statements.map((stmt, idx) => (
            <div 
              key={idx} 
              className="bg-[#090909] border border-[#141414] rounded-lg p-4 flex items-start gap-4 transition-all duration-300 hover:border-white/10 hover:bg-[#0c0c0c] shadow-[0_1px_5px_rgba(0,0,0,0.5)]"
            >
              <span className="font-mono text-xs text-[#444] font-bold py-0.5">
                0{idx + 1}
              </span>
              <p className="text-xs text-[#BBB] leading-relaxed tracking-wide font-sans">
                {stmt}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars of Strength status gauges */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 pb-1 border-b border-[#141414]">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#555] font-semibold">
            📊 Focus Categories
          </span>
        </div>

        <div className="bg-[#0A0A0A] border border-[#141414] rounded-lg p-6 space-y-5.5 shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          
          {/* Pillar 1: Physical */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="tracking-wide text-[#E0E0E0] font-sans">Physical</span>
              <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider font-semibold">
                LVL {Math.max(1, Math.floor((userProfile.categoryXp?.physical || 3200) / 100))}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#121212] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPillarProgress(Math.floor((userProfile.categoryXp?.physical || 3200) / 100))}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-white/70"
              />
            </div>
          </div>

          {/* Pillar 2: Mental / Reading */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="tracking-wide text-[#E0E0E0] font-sans">Mental</span>
              <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider font-semibold">
                LVL {Math.max(1, Math.floor((userProfile.categoryXp?.reading || 2800) / 100))}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#121212] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPillarProgress(Math.floor((userProfile.categoryXp?.reading || 2800) / 100))}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-white/70"
              />
            </div>
          </div>

          {/* Pillar 3: Career */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="tracking-wide text-[#E0E0E0] font-sans">Career</span>
              <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider font-semibold">
                LVL {Math.max(1, Math.floor((userProfile.categoryXp?.career || 4100) / 100))}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#121212] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPillarProgress(Math.floor((userProfile.categoryXp?.career || 4100) / 100))}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-white/70"
              />
            </div>
          </div>

          {/* Pillar 4: Spiritual */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="tracking-wide text-[#E0E0E0] font-sans">Spiritual</span>
              <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider font-semibold">
                LVL {Math.max(1, Math.floor((userProfile.categoryXp?.spiritual || 15) / 100))}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#121212] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPillarProgress(Math.floor((userProfile.categoryXp?.spiritual || 15) / 100))}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-white/70"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
