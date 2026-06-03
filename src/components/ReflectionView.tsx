import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, CheckSquare, Pencil, AlignLeft, Calendar } from 'lucide-react';
import { UserProfile, JournalReflection } from '../types';

interface ReflectionViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function ReflectionView({ userProfile, onUpdateProfile }: ReflectionViewProps) {
  const currentDateKey = new Date().toISOString().split('T')[0];

  const [draftBuild, setDraftBuild] = useState('');
  const [draftLearn, setDraftLearn] = useState('');
  const [draftGratitude, setDraftGratitude] = useState('');
  
  const [submittedToday, setSubmittedToday] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing journal entries if registered for today
  useEffect(() => {
    const reflectionsList = userProfile.reflections || [];
    const todayRef = reflectionsList.find(r => r.date === currentDateKey);
    
    if (todayRef) {
      setDraftBuild(todayRef.build);
      setDraftLearn(todayRef.learn);
      setDraftGratitude(todayRef.gratitude);
      setSubmittedToday(todayRef.submitted);
    } else {
      setDraftBuild('');
      setDraftLearn('');
      setDraftGratitude('');
      setSubmittedToday(false);
    }
  }, [userProfile, currentDateKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!draftBuild.trim() && !draftLearn.trim() && !draftGratitude.trim()) {
      alert("Please write a brief entry before saving.");
      return;
    }

    const currentReflections = [...(userProfile.reflections || [])];
    const rest = currentReflections.filter(r => r.date !== currentDateKey);

    const newReflection: JournalReflection = {
      date: currentDateKey,
      build: draftBuild.trim(),
      learn: draftLearn.trim(),
      gratitude: draftGratitude.trim(),
      submitted: true
    };

    const nextRefReflections = [...rest, newReflection];

    // Award reflection XP bonus (+150 XP) if this is the first submission today!
    const isFirstTimeToday = !submittedToday;
    const xpBonus = isFirstTimeToday ? 150 : 0;
    
    const nextLifetimeXp = userProfile.lifetimeXp + xpBonus;
    const nextXpToday = userProfile.xpToday + xpBonus;
    const nextLevel = Math.max(1, Math.floor(nextLifetimeXp / 1000) + 1);

    if (isFirstTimeToday && navigator.vibrate) {
      navigator.vibrate([40, 20, 60]);
    }

    onUpdateProfile({
      ...userProfile,
      lifetimeXp: nextLifetimeXp,
      xpToday: nextXpToday,
      level: nextLevel,
      reflections: nextRefReflections
    });

    setSubmittedToday(true);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-12 select-none">
      
      {/* Informational Banner Area */}
      <section className="space-y-4 text-center py-4 px-4 bg-[#0A0A0A] border border-[#141414] mt-3 rounded-lg shadow-md">
        <p className="font-serif italic font-light text-[15px] leading-relaxed text-[#BBB] max-w-md mx-auto">
          "A space to record today's actions."
        </p>
      </section>

      {/* Persistence confirmation overlay banner */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest text-center flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Progress recorded</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-7">
        
        {/* Card Row 1: What was built today */}
        <div className="space-y-3">
          <label className="block text-[#E0E0E0] font-sans text-sm font-semibold tracking-wide">
            What was built today?
          </label>
          <div className="relative">
            <textarea
              readOnly={submittedToday}
              value={draftBuild}
              onChange={(e) => setDraftBuild(e.target.value)}
              placeholder="Reflect on creations, tasks completed, or progress made..."
              rows={4}
              className={`w-full bg-[#0A0A0A] border rounded-lg p-4 font-sans text-xs sm:text-sm leading-relaxed tracking-wide text-white placeholder-[#555] outline-none transition-all resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] ${
                submittedToday 
                  ? 'border-[#151515] opacity-75 cursor-not-allowed' 
                  : 'border-[#181818] focus:border-white/30'
              }`}
            />
          </div>
        </div>

        {/* Card Row 2: What was learned today */}
        <div className="space-y-3">
          <label className="block text-[#E0E0E0] font-sans text-sm font-semibold tracking-wide">
            What was learned today?
          </label>
          <div className="relative">
            <textarea
              readOnly={submittedToday}
              value={draftLearn}
              onChange={(e) => setDraftLearn(e.target.value)}
              placeholder="Insights, mistakes, or knowledge acquired..."
              rows={4}
              className={`w-full bg-[#0A0A0A] border rounded-lg p-4 font-sans text-xs sm:text-sm leading-relaxed tracking-wide text-white placeholder-[#555] outline-none transition-all resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] ${
                submittedToday 
                  ? 'border-[#151515] opacity-75 cursor-not-allowed' 
                  : 'border-[#181818] focus:border-white/30'
              }`}
            />
          </div>
        </div>

        {/* Card Row 3: What is noted today */}
        <div className="space-y-3">
          <label className="block text-[#E0E0E0] font-sans text-sm font-semibold tracking-wide">
            What is noted today?
          </label>
          <div className="relative">
            <textarea
              readOnly={submittedToday}
              value={draftGratitude}
              onChange={(e) => setDraftGratitude(e.target.value)}
              placeholder="Small wins, moments of peace, or observations..."
              rows={4}
              className={`w-full bg-[#0A0A0A] border rounded-lg p-4 font-sans text-xs sm:text-sm leading-relaxed tracking-wide text-white placeholder-[#555] outline-none transition-all resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] ${
                submittedToday 
                  ? 'border-[#151515] opacity-75 cursor-not-allowed' 
                  : 'border-[#181818] focus:border-white/30'
              }`}
            />
          </div>
        </div>

        {/* Lower Submit Button plate */}
        <div className="pt-2 flex flex-col items-center">
          {submittedToday ? (
            <div className="w-full space-y-3.5">
              <button
                type="button"
                onClick={() => setSubmittedToday(false)}
                className="w-full border border-white/20 hover:border-white/30 text-white/80 hover:text-white px-6 py-4 font-headline font-semibold text-[11px] uppercase tracking-[0.25em] bg-[#0A0A0A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(255,255,255,0.02)]"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit entry</span>
              </button>
              
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#444] text-center">
                Logged on {currentDateKey} UTC
              </p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-[#0E0E0E] hover:bg-neutral-900 border border-white/10 hover:border-white/30 text-white px-6 py-4.5 font-headline font-semibold text-[11px] uppercase tracking-[0.25em] transition-all active:scale-98 flex items-center justify-center gap-3.5 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            >
              <span>Save entry</span>
              <Check className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

      </form>

    </div>
  );
}
