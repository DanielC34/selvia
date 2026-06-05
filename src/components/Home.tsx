import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  Compass,
  RotateCcw,
  Sparkles,
  User,
  AlignLeft,
  Award,
  BookOpen,
  Home as HomeIcon
} from 'lucide-react';
import { UserProfile } from '../types';

// Importing sub-screens
import HomeDashboard from './HomeDashboard';
import CharacterView from './CharacterView';
import JourneyView from './JourneyView';
import ReflectionView from './ReflectionView';
import AchievementsView from './AchievementsView';

interface HomeProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onResetOnboarding: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function Home({
  userProfile,
  onLogout,
  onResetOnboarding,
  onUpdateProfile
}: HomeProps) {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Guarantee profile has the extended progression fields loaded & check daily reset
  useEffect(() => {
    let needsUpdate = false;
    const updated = { ...userProfile };
    const todayStr = new Date().toISOString().split('T')[0];

    if (updated.lifetimeXp === undefined) {
      updated.lifetimeXp = 124500;
      needsUpdate = true;
    }
    if (updated.xpToday === undefined) {
      updated.xpToday = 450;
      needsUpdate = true;
    }
    if (updated.level === undefined) {
      updated.level = 24;
      needsUpdate = true;
    }
    if (!updated.dailyActions || updated.dailyActions.length === 0) {
      updated.dailyActions = [
        { id: 'act-sp', category: 'spiritual', name: 'Morning Meditation (20m)', completed: true, xpValue: 100 },
        { id: 'act-ph', category: 'physical', name: 'Strength Training', completed: true, xpValue: 100 },
        { id: 'act-rd', category: 'reading', name: 'Stoic Philosophy (15 pgs)', completed: false, xpValue: 100 },
        { id: 'act-cr', category: 'career', name: 'Deep Work Block (2h)', completed: true, xpValue: 100 },
        { id: 'act-bu', category: 'builder', name: 'Side Project Commits', completed: true, xpValue: 100 }
      ];
      needsUpdate = true;
    }
    if (!updated.reflections) {
      updated.reflections = [
        {
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          build: 'Forged active character core profile views & navigation logic',
          learn: 'Discovered CSS spline scaling on SVG line vectors',
          gratitude: 'Happy for calm responsive web structures',
          submitted: true
        }
      ];
      needsUpdate = true;
    }
    if (!updated.unlockedAchievements) {
      updated.unlockedAchievements = ['ach-7day', 'ach-30workout', 'ach-100session'];
      needsUpdate = true;
    }
    if (!updated.categoryXp) {
      updated.categoryXp = { spiritual: 1500, physical: 3200, reading: 2800, career: 4100, builder: 3500 };
      needsUpdate = true;
    }
    if (!updated.categoryStreaks) {
      updated.categoryStreaks = { spiritual: 15, physical: 32, reading: 28, career: 41, builder: 35 };
      needsUpdate = true;
    }

    // Set daily login record and verify daily reset with deterministic system day tracking
    const systemDate = new Date();
    const currentDayKey = systemDate.getFullYear() + '-' + String(systemDate.getMonth() + 1).padStart(2, '0') + '-' + String(systemDate.getDate()).padStart(2, '0');
    const storedDayKey = updated.storedDayKey || updated.lastActiveDate || currentDayKey;

    if (!updated.lastActiveDate || !updated.storedDayKey) {
      updated.lastActiveDate = currentDayKey;
      updated.storedDayKey = currentDayKey;
      needsUpdate = true;
    } else if (updated.lastActiveDate === 'simulate-tomorrow-pending') {
      // Manual test simulation reset
      updated.dailyActions = updated.dailyActions.map(action => ({
        ...action,
        completed: false
      }));
      updated.xpToday = 0;
      updated.lastCompletedDate = undefined;
      updated.lastActiveDate = currentDayKey;
      updated.storedDayKey = currentDayKey;
      needsUpdate = true;
    } else if (storedDayKey !== currentDayKey) {
      // Clock rollover mismatch detected - reset daily progress safely
      updated.dailyActions = updated.dailyActions.map(action => ({
        ...action,
        completed: false
      }));
      updated.xpToday = 0;
      updated.lastActiveDate = currentDayKey;
      updated.storedDayKey = currentDayKey;
      needsUpdate = true;
    }

    if (needsUpdate) {
      onUpdateProfile(updated);
    }
  }, [userProfile]);

  // Compute total xp level fraction (e.g., 1000 XP per level)
  const xpInCurrentLevel = userProfile.lifetimeXp % 1000;
  const levelProgressFraction = xpInCurrentLevel / 10; // returns percent representation

  const handleUpdateProfile = (updated: UserProfile) => {
    onUpdateProfile(updated);
  };

  const currentTabStyle = "w-full max-w-2xl mx-auto px-4 md:px-6 pt-2 pb-24";

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-sans relative overflow-x-hidden select-none">
      
      {/* Persistent global app HUD header block */}
      <header className="w-full bg-[#050505]/95 backdrop-blur-md border-b border-[#111] sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4 py-4 md:px-6">
          
          {/* Logo brand label */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-md">
              <Compass className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
            </div>
            <div>
              <h1 className="font-serif text-[17px] font-light italic text-white tracking-wider leading-none mb-0.5">
                Selvia
              </h1>
              <span className="text-[8px] uppercase font-mono tracking-[0.25em] text-[#555] block font-semibold">
                Progression HUD
              </span>
            </div>
          </div>

          {/* Level level progression visual meter */}
          <div className="flex items-center gap-4">
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-white/90">
                LVL {userProfile.level || 24}
              </span>
              {/* Level progress bar block */}
              <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden mt-1 bg-[#111] border border-white/[0.01]">
                <div 
                  className="h-full bg-emerald-400/90" 
                  style={{ width: `${levelProgressFraction || 50}%` }}
                />
              </div>
            </div>

            {/* Micro diagnostic trigger to reset simulation */}
            <button
              onClick={onLogout}
              className="p-2 border border-[#111] hover:border-red-950 hover:bg-red-950/15 text-[#555] hover:text-red-400 rounded-md transition-all active:scale-95 cursor-pointer"
              title="Logout Profile Coordinates"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </header>

      {/* Primary scroll viewport body container */}
      <main className="flex-grow overflow-y-auto">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className={currentTabStyle}
          >
            {activeTab === 'home' && (
              <HomeDashboard 
                userProfile={userProfile} 
                onUpdateProfile={handleUpdateProfile}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}
            
            {activeTab === 'character' && (
              <CharacterView userProfile={userProfile} />
            )}

            {activeTab === 'journey' && (
              <JourneyView userProfile={userProfile} />
            )}

            {activeTab === 'reflection' && (
              <ReflectionView 
                userProfile={userProfile} 
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'medals' && (
              <AchievementsView userProfile={userProfile} />
            )}

          </motion.div>
        </AnimatePresence>

      </main>

      {/* Floating System Reset Drawer Panel */}
      <div className="w-full bg-[#030303] border-t border-[#111] p-3 text-center flex items-center justify-center gap-3">
        <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#444]">Coordinate Tools:</span>
        <button
          onClick={onResetOnboarding}
          className="bg-[#0A0A0A] border border-[#181818] hover:border-white/10 hover:text-white text-[9px] font-mono uppercase tracking-[0.2em] py-1.5 px-3 rounded-none active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer text-[#666]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Path onboarding</span>
        </button>
        <button
          onClick={() => {
            const updated = {
              ...userProfile,
              lastActiveDate: 'simulate-tomorrow-pending'
            };
            onUpdateProfile(updated);
          }}
          className="bg-[#0A0A0A] border border-[#181818] hover:border-white/10 hover:text-emerald-400 text-[9px] font-mono uppercase tracking-[0.2em] py-1.5 px-3 rounded-none active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer text-[#666]"
          title="Simulate daily rollover reset manually"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Simulate Tomorrow (Reset Tool)</span>
        </button>
      </div>

      {/* Bottom Pinned Fixed Navigation Controller */}
      <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-black/95 backdrop-blur-md border-t border-[#111] flex items-center justify-around px-4 z-40 max-w-5xl mx-auto">
        
        {/* Tab 1: Home Dashboard */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors duration-200 relative cursor-pointer ${
            activeTab === 'home' ? 'text-white' : 'text-[#555] hover:text-neutral-400'
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Home</span>
          {activeTab === 'home' && (
            <motion.div layoutId="nav-pill" className="absolute -top-3 w-6 h-0.5 bg-white" />
          )}
        </button>

        {/* Tab 2: Character System */}
        <button
          onClick={() => setActiveTab('character')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors duration-200 relative cursor-pointer ${
            activeTab === 'character' ? 'text-white' : 'text-[#555] hover:text-neutral-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Character</span>
          {activeTab === 'character' && (
            <motion.div layoutId="nav-pill" className="absolute -top-3 w-6 h-0.5 bg-white" />
          )}
        </button>

        {/* Tab 3: Reflection prompt */}
        <button
          onClick={() => setActiveTab('reflection')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors duration-200 relative cursor-pointer ${
            activeTab === 'reflection' ? 'text-white' : 'text-[#555] hover:text-neutral-400'
          }`}
        >
          <AlignLeft className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Reflection</span>
          {activeTab === 'reflection' && (
            <motion.div layoutId="nav-pill" className="absolute -top-3 w-6 h-0.5 bg-white" />
          )}
        </button>

        {/* Tab 4: Journey consistency tracker */}
        <button
          onClick={() => setActiveTab('journey')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors duration-200 relative cursor-pointer ${
            activeTab === 'journey' ? 'text-white' : 'text-[#555] hover:text-neutral-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Journey</span>
          {activeTab === 'journey' && (
            <motion.div layoutId="nav-pill" className="absolute -top-3 w-6 h-0.5 bg-white" />
          )}
        </button>

        {/* Tab 5: Medals Achievements Achievements */}
        <button
          onClick={() => setActiveTab('medals')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors duration-200 relative cursor-pointer ${
            activeTab === 'medals' ? 'text-white' : 'text-[#555] hover:text-neutral-400'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">Medals</span>
          {activeTab === 'medals' && (
            <motion.div layoutId="nav-pill" className="absolute -top-3 w-6 h-0.5 bg-white" />
          )}
        </button>

      </nav>

    </div>
  );
}
