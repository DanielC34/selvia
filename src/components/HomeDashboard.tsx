import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Activity, 
  BookOpen, 
  Briefcase, 
  Hammer, 
  Check, 
  Flame, 
  Zap, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { UserProfile, DailyAction } from '../types';

interface HomeDashboardProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function HomeDashboard({ 
  userProfile, 
  onUpdateProfile,
  onNavigateToTab 
}: HomeDashboardProps) {
  const [floatingXp, setFloatingXp] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [triggerCount, setTriggerCount] = useState(0);
  const [justActivated, setJustActivated] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const dailyActions = userProfile.dailyActions || [];
  const completedCount = dailyActions.filter(a => a.completed).length;
  const totalCount = dailyActions.length || 5;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Active state is completed if sealed date equals today or if they physically completed everything
  const isCompleted = userProfile.lastCompletedDate === todayStr || (totalCount > 0 && completedCount === totalCount);

  // Render Roman Numeral for Discipline Category Tier
  const getDisciplineTier = (lvl: number) => {
    const tiers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const idx = Math.floor(lvl / 5);
    return tiers[Math.min(idx, tiers.length - 1)] || 'X';
  };

  const spawnXpFloat = (text: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left || 40;
    const y = e.clientY - rect.top || -10;
    const newId = triggerCount + 1;
    setTriggerCount(newId);
    setFloatingXp(prev => [...prev, { id: newId, text, x, y }]);
    setTimeout(() => {
      setFloatingXp(prev => prev.filter(item => item.id !== newId));
    }, 1000);
  };

  const handleToggleAction = (actionId: string, e: React.MouseEvent) => {
    // Prevent task interactions if today's progress has been sealed
    if (userProfile.lastCompletedDate === todayStr) {
      return;
    }

    const targetAction = dailyActions.find(a => a.id === actionId);
    if (!targetAction) return;

    const isNowCompleted = !targetAction.completed;
    
    // Haptics integration
    if (isNowCompleted && navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Trigger visual +XP or -XP float
    const xpChangeText = isNowCompleted ? `+${targetAction.xpValue} XP` : `-${targetAction.xpValue} XP`;
    spawnXpFloat(xpChangeText, e);

    const updatedActions = dailyActions.map(action => {
      if (action.id === actionId) {
        return { ...action, completed: isNowCompleted };
      }
      return action;
    });

    const isCompletedJustNow = updatedActions.every(a => a.completed);

    // Compute new system scores
    let xpGain = isNowCompleted ? targetAction.xpValue : -targetAction.xpValue;
    
    // Discipline bonus on completing the day
    if (isCompletedJustNow) {
      xpGain += 500; // completion bonus
    }

    const nextLifetimeXp = Math.max(0, userProfile.lifetimeXp + xpGain);
    const nextXpToday = Math.max(0, userProfile.xpToday + xpGain);

    // Dynamic level calculations (e.g. 1000 XP per level)
    const nextLevel = Math.max(1, Math.floor(nextLifetimeXp / 1000) + 1);

    // Category progress scores
    const cat = targetAction.category;
    const categoryXpMap = { ...(userProfile.categoryXp || { spiritual: 0, physical: 0, reading: 0, career: 0, builder: 0 }) };
    categoryXpMap[cat] = Math.max(0, (categoryXpMap[cat] || 0) + (isNowCompleted ? targetAction.xpValue : -targetAction.xpValue));

    // Active category streaks progression
    const categoryStreaksMap = { ...(userProfile.categoryStreaks || { spiritual: 0, physical: 0, reading: 0, career: 0, builder: 0 }) };
    if (isNowCompleted) {
      categoryStreaksMap[cat] = (categoryStreaksMap[cat] || 0) + 1;
    } else {
      categoryStreaksMap[cat] = Math.max(0, (categoryStreaksMap[cat] || 1) - 1);
    }

    // Daily streak logic
    let nextStreak = userProfile.streak;
    const allCompletedForToday = updatedActions.every(a => a.completed);
    if (allCompletedForToday && !dailyActions.every(a => a.completed)) {
      nextStreak += 1;
    } else if (!allCompletedForToday && dailyActions.every(a => a.completed)) {
      nextStreak = Math.max(1, nextStreak - 1);
    }

    const nextProfile: UserProfile = {
      ...userProfile,
      streak: nextStreak,
      lifetimeXp: nextLifetimeXp,
      xpToday: nextXpToday,
      level: nextLevel,
      dailyActions: updatedActions,
      categoryXp: categoryXpMap,
      categoryStreaks: categoryStreaksMap
    };

    if (isCompletedJustNow) {
      nextProfile.lastCompletedDate = todayStr;
      
      // Soft micro-haptics double-pulse
      if (navigator.vibrate) {
        navigator.vibrate([30, 30]);
      }

      setJustActivated(true);
      setTimeout(() => {
        setJustActivated(false);
      }, 5500);
    }

    if (isNowCompleted && navigator.vibrate) {
      navigator.vibrate(25);
    }

    onUpdateProfile(nextProfile);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spiritual':
        return <Sparkles className="w-5 h-5 text-white/90" />;
      case 'physical':
        return <Activity className="w-5 h-5 text-white/90" />;
      case 'reading':
        return <BookOpen className="w-5 h-5 text-white/90" />;
      case 'career':
        return <Briefcase className="w-5 h-5 text-white/90" />;
      case 'builder':
        return <Hammer className="w-5 h-5 text-white/90" />;
      default:
        return <Zap className="w-5 h-5 text-white/90" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    if (category === 'reading') return 'Reading';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-8 pb-12 select-none relative text-[#E0E0E0]">
      
      {/* Dynamic Floating XP element list */}
      <AnimatePresence>
        {floatingXp.map(item => (
          <motion.span
            key={item.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0], y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute font-mono text-[9.5px] tracking-widest text-[#AAA] pointer-events-none z-50 select-none"
            style={{ left: item.x, top: item.y }}
          >
            {item.text}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Hero Circular Momentum Progress Section */}
      <section className="flex flex-col items-center justify-center py-6 relative">
        <div className="relative w-56 h-56 flex items-center justify-center">
          
          {/* Soft pulse glow halo expansion */}
          <AnimatePresence>
            {(isCompleted || justActivated) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ 
                  opacity: justActivated ? [0.1, 0.35, 0.15] : [0.1, 0.15, 0.1],
                  scale: [0.95, 1.15, 1.05, 1.15] 
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: justActivated ? 3 : 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute w-48 h-48 bg-white/[0.03] rounded-full blur-3xl pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Circular Rings Container */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#0E0E0E]"
              strokeWidth="4"
              fill="transparent"
            />
            
            {/* Real Progress indicator ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#E0E0E0]"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray="276.46"
              initial={{ strokeDashoffset: 276.46 }}
              animate={{ strokeDashoffset: 276.46 - (276.46 * (isCompleted ? 100 : percentComplete)) / 100 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              strokeLinecap="round"
            />
          </svg>

          {/* Core Info label stats */}
          <div className="absolute text-center flex flex-col items-center justify-center">
            <motion.span 
              key={isCompleted ? 100 : percentComplete}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-serif text-5xl font-light text-white leading-none tracking-tight block"
            >
              {isCompleted ? 100 : percentComplete}%
            </motion.span>
            
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#666] mt-3 block max-w-[130px] leading-tight">
              {isCompleted ? "Fulfilling" : "Keep going"}
            </span>
          </div>

        </div>

        {/* Pristine, calm completion confirmation float */}
        <AnimatePresence>
          {justActivated && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], scale: 1, y: -40 }}
                transition={{ duration: 3.5, ease: "easeOut" }}
                className="absolute font-mono text-[9px] tracking-[0.25em] text-emerald-400 bg-black/95 py-2 px-4 border border-emerald-500/20 shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
              >
                +500 DISCIPLINE XP
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {isCompleted && (
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="flex flex-col items-center justify-center p-6 border border-emerald-500/10 bg-emerald-950/5 text-center select-none"
        >
          <div className="space-y-4">
            <h2 className="font-serif italic font-light text-2xl text-white tracking-widest leading-relaxed">
              Day complete.
            </h2>
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.25em] text-[#888] uppercase">
              You showed up today.
            </p>

            <div className="pt-2 flex flex-col items-center gap-1">
              <span className="inline-block py-1 px-3 border border-emerald-500/10 bg-emerald-950/20 text-[9px] font-mono text-emerald-400 uppercase tracking-[0.25em] font-semibold">
                Consistency recorded
              </span>
              <p className="text-[8.5px] text-[#555] uppercase tracking-[0.15em] font-mono mt-1">
                Momentum maintained for your archetype.
              </p>
            </div>
          </div>
        </motion.section>
      )}

      {/* Quick 3-Tile Status Banner Area */}
      <section className="grid grid-cols-3 gap-3.5">
        
        {/* Card 1: Discipline Category Level */}
        <div className="bg-[#0A0A0A] border border-[#141414] rounded-lg p-4 py-5 flex flex-col items-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <span className="font-serif text-xl font-light text-white tracking-wide block">
            {getDisciplineTier(userProfile.level)}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#555] mt-1.5 font-semibold">
            Tiers
          </span>
        </div>

        {/* Card 2: Today Accumulated XP */}
        <div className="bg-[#0A0A0A] border border-[#141414] rounded-lg p-4 py-5 flex flex-col items-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <span className="font-sans text-xl font-medium text-white tracking-wide block">
            +{userProfile.xpToday}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#555] mt-1.5 font-semibold">
            XP logged today
          </span>
        </div>

        {/* Card 3: Continuous Streak */}
        <div className="bg-[#0A0A0A] border border-[#141414] rounded-lg p-4 py-5 flex flex-col items-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-white fill-white/10" />
            <span className="font-sans text-xl font-bold text-white tracking-wide block">
              {userProfile.streak}
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#555] mt-1.5 font-semibold">
            Daily streak
          </span>
        </div>

      </section>

      {/* Daily Progress Core Block List */}
      <section className="space-y-4">
        
        <div className="flex justify-between items-end pb-1 border-b border-[#141414] mb-5">
          <h2 className="font-serif italic font-light text-xl text-white tracking-wide">
            Daily commitments
          </h2>
          <span className="font-mono text-[10px] text-[#666] uppercase tracking-widest font-semibold">
            {completedCount}/{totalCount} completed
          </span>
        </div>

        <div className="space-y-3.5">
          {dailyActions.map((action) => (
            <motion.div
              layoutId={`action-card-${action.id}`}
              key={action.id}
              onClick={(e) => handleToggleAction(action.id, e)}
              className={`w-full text-left p-4 rounded-lg bg-[#0A0A0A] border transition-all duration-300 flex items-center justify-between select-none ${
                isCompleted
                  ? 'border-white/15 bg-white/[0.01] opacity-75 cursor-default'
                  : action.completed 
                  ? 'border-white/20 bg-white/[0.01] cursor-pointer' 
                  : 'border-[#151515] hover:border-[#252525] hover:bg-[#0c0c0c] cursor-pointer'
              }`}
            >
              
              {/* Left description parameters */}
              <div className="flex items-center gap-4 py-0.5 truncate">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300 shadow-[0_1px_5px_rgba(0,0,0,0.5)] ${
                  action.completed 
                    ? 'border-white/30 bg-white/5' 
                    : 'border-[#222] bg-[#0E0E0E]'
                }`}>
                  {getCategoryIcon(action.category)}
                </div>
                <div className="truncate">
                  <span className={`text-[10px] uppercase font-mono tracking-widest font-semibold block transition-colors duration-300 ${
                    action.completed ? 'text-[#888]' : 'text-[#444]'
                  }`}>
                    {getCategoryTitle(action.category)}
                  </span>
                  <span className={`text-sm tracking-wide font-sans mt-0.5 block truncate transition-all duration-300 ${
                    action.completed ? 'text-[#888] line-through decoration-white/20' : 'text-white'
                  }`}>
                    {action.name}
                  </span>
                </div>
              </div>

              {/* Right selector circle stamp */}
              <div className="pl-4">
                <div className={`w-8 h-8 rounded-full border transition-all duration-300 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
                  action.completed 
                    ? 'bg-white border-white text-black' 
                    : 'bg-transparent border-[#222]'
                }`}>
                  {action.completed ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#111]" />
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </section>

      {/* Floating Action/Prompt: Review Journal */}
      {!isCompleted && (
        <section className="bg-[#0A0A0A] border border-[#151515] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          <div>
            <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-[#555] font-semibold">Reflection</span>
            <h3 className="font-serif italic font-light text-base text-white mt-1">Reflection due</h3>
            <p className="text-[10px] text-[#666] uppercase tracking-wider mt-0.5">Record reflections to keep track of daily insights.</p>
          </div>
          <button
            onClick={() => onNavigateToTab('reflection')}
            className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black px-5 py-2.5 font-headline font-semibold text-[10px] uppercase tracking-[0.2em] rounded-none active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(255,255,255,0.05)]"
          >
            <span>Reflect</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

    </div>
  );
}
