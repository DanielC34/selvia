import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Hammer, Activity, BookOpen, Sparkles, Edit2 } from 'lucide-react';

interface Step2Props {
  initialArchetype: string;
  initialCustomText: string;
  onBack: () => void;
  onConfirm: (archetypeId: string, customText: string) => void;
}

export default function Step2Identity({
  initialArchetype,
  initialCustomText,
  onBack,
  onConfirm
}: Step2Props) {
  const [selected, setSelected] = useState<string>(initialArchetype);
  const [customText, setCustomText] = useState<string>(initialCustomText);

  // Clear radio checkboxes when the user types custom identity text
  useEffect(() => {
    if (customText.trim().length > 0 && selected !== 'custom') {
      setSelected('custom');
    }
  }, [customText]);

  const handleSelectArchetype = (id: string) => {
    setSelected(id);
    setCustomText(''); // Clear typing since they selected a card
  };

  const handleCustomInputChange = (value: string) => {
    setCustomText(value);
    if (value.trim().length > 0) {
      setSelected('custom');
    } else {
      setSelected('');
    }
  };

  const handleNext = () => {
    if (!selected) {
      alert('Please select an identity focus or type your own.');
      return;
    }
    if (selected === 'custom' && customText.trim().length === 0) {
      alert('Please enter your custom identity focus.');
      return;
    }
    
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    onConfirm(selected, selected === 'custom' ? customText : '');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-sans relative overflow-x-hidden select-none">
      
      {/* Top Navbar HUD */}
      <nav className="h-16 border-b border-[#1A1A1A] flex items-center justify-between px-6 md:px-10 bg-[#080808] z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#666] hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.2em]">Back</span>
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-[#666]">Step 02 of 04</span>
            <span className="text-xs font-medium text-[#AAA]">Identity Select</span>
          </div>
          <div className="w-24 h-1 bg-[#1A1A1A] rounded-full overflow-hidden hidden sm:block">
            <div className="w-2/4 h-full bg-[#E0E0E0]"></div>
          </div>
        </div>
      </nav>

      {/* Main Dual Column Layout */}
      <div className="flex-1 flex flex-row">
        
        {/* Left column for Desktop */}
        <section className="w-1/3 border-r border-[#1A1A1A] p-10 hidden lg:flex flex-col justify-center bg-[#050505]">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#666] mb-8 font-mono">Setup Path</span>
          <div className="space-y-6">
            <div className="flex items-center gap-4 opacity-30">
              <div className="w-6 h-6 rounded-full border border-[#444] flex items-center justify-center text-[10px] font-mono">01</div>
              <span className="text-sm">Account</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold font-mono">02</div>
              <span className="text-sm font-semibold text-white italic font-serif">Identity Focus</span>
            </div>

            <div className="flex items-center gap-4 opacity-30">
              <div className="w-6 h-6 rounded-full border border-[#444] flex items-center justify-center text-[10px] font-mono">03</div>
              <span className="text-sm">Commitments</span>
            </div>

            <div className="flex items-center gap-4 opacity-30">
              <div className="w-6 h-6 rounded-full border border-[#444] flex items-center justify-center text-[10px] font-mono">04</div>
              <span className="text-sm">Confirm Setup</span>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-[#1A1A1A]">
            <p className="text-xs leading-relaxed text-[#555] italic font-serif">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </p>
          </div>
        </section>

        {/* Right Selection Content */}
        <section className="flex-1 bg-[#070707] p-6 sm:p-12 md:p-16 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-2xl w-full mx-auto text-center mb-8">
            <h1 className="text-3xl sm:text-4xl mb-3 font-light text-white font-serif italic">What is your primary focus?</h1>
            <p className="text-[#888] text-xs sm:text-sm tracking-wide max-w-md mx-auto">
              Select the category that best aligns with your daily commitments.
            </p>
          </div>

          {/* Archetype Options list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full mx-auto mb-8">
            
            {/* Disciplined Builder */}
            <div
              onClick={() => handleSelectArchetype('disciplined_builder')}
              className={`group bg-[#0A0A0A] border p-6 rounded-lg cursor-pointer relative transition-all duration-300 ${
                selected === 'disciplined_builder' 
                  ? 'border-white bg-[#111111]' 
                  : 'border-[#1A1A1A] hover:border-[#444]'
              }`}
            >
              <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full transition-colors duration-300 flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${selected === 'disciplined_builder' ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <Hammer className={`w-4 h-4 ${selected === 'disciplined_builder' ? 'text-white' : 'text-[#666]'}`} />
                <h3 className="text-base font-serif italic text-white font-semibold">Systems / Structure</h3>
              </div>
              <p className={`text-xs leading-relaxed ${selected === 'disciplined_builder' ? 'text-[#AAA]' : 'text-[#555]'}`}>
                Deep work, constructive routines, and systematic daily consistency.
              </p>
            </div>

            {/* Physically Active Self */}
            <div
              onClick={() => handleSelectArchetype('physically_active')}
              className={`group bg-[#0A0A0A] border p-6 rounded-lg cursor-pointer relative transition-all duration-300 ${
                selected === 'physically_active' 
                  ? 'border-white bg-[#111111]' 
                  : 'border-[#1A1A1A] hover:border-[#444]'
              }`}
            >
              <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full transition-colors duration-300 flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${selected === 'physically_active' ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <Activity className={`w-4 h-4 ${selected === 'physically_active' ? 'text-white' : 'text-[#666]'}`} />
                <h3 className="text-base font-serif italic text-white font-semibold">Energy / Vitality</h3>
              </div>
              <p className={`text-xs leading-relaxed ${selected === 'physically_active' ? 'text-[#AAA]' : 'text-[#555]'}`}>
                Regular body training, physical discipline, and physical consistency.
              </p>
            </div>

            {/* Focused Learner */}
            <div
              onClick={() => handleSelectArchetype('focused_learner')}
              className={`group bg-[#0A0A0A] border p-6 rounded-lg cursor-pointer relative transition-all duration-300 ${
                selected === 'focused_learner' 
                  ? 'border-white bg-[#111111]' 
                  : 'border-[#1A1A1A] hover:border-[#444]'
              }`}
            >
              <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full transition-colors duration-300 flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${selected === 'focused_learner' ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <BookOpen className={`w-4 h-4 ${selected === 'focused_learner' ? 'text-white' : 'text-[#666]'}`} />
                <h3 className="text-base font-serif italic text-white font-semibold">Mental / Learning</h3>
              </div>
              <p className={`text-xs leading-relaxed ${selected === 'focused_learner' ? 'text-[#AAA]' : 'text-[#555]'}`}>
                Continuous learning, focused reading, and mental exercises.
              </p>
            </div>

            {/* Spiritually Grounded */}
            <div
              onClick={() => handleSelectArchetype('spiritually_grounded')}
              className={`group bg-[#0A0A0A] border p-6 rounded-lg cursor-pointer relative transition-all duration-300 ${
                selected === 'spiritually_grounded' 
                  ? 'border-white bg-[#111111]' 
                  : 'border-[#1A1A1A] hover:border-[#444]'
              }`}
            >
              <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full transition-colors duration-300 flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${selected === 'spiritually_grounded' ? 'bg-white' : 'bg-[#1A1A1A]'}`} />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <Sparkles className={`w-4 h-4 ${selected === 'spiritually_grounded' ? 'text-white' : 'text-[#666]'}`} />
                <h3 className="text-base font-serif italic text-white font-semibold">Mind / Balance</h3>
              </div>
              <p className={`text-xs leading-relaxed ${selected === 'spiritually_grounded' ? 'text-[#AAA]' : 'text-[#555]'}`}>
                Meditation, mindfulness, and quiet daily focus.
              </p>
            </div>

          </div>

          {/* Forge your own selection input */}
          <div className="mb-8 max-w-3xl w-full mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px bg-[#1A1A1A] flex-1" />
              <span className="font-mono text-[9px] text-[#555] uppercase tracking-widest">Or enter a custom category text</span>
              <div className="h-px bg-[#1A1A1A] flex-1" />
            </div>

            <div className="relative group p-1">
              <input
                type="text"
                value={customText}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                className="w-full bg-transparent border-b border-[#1A1A1A] px-1 py-2 text-base font-serif italic text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-colors"
                placeholder="Type a custom identifier..."
              />
            </div>
          </div>

          {/* Action Button HUD */}
          <div className="w-full max-w-xs mx-auto text-center flex flex-col items-center gap-2 pt-2">
            <button
              onClick={handleNext}
              className="w-full bg-white text-black font-headline font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-none hover:bg-neutral-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-2 text-[10px] text-[#444] uppercase tracking-widest hidden sm:block">
              Proceed to daily mandates
            </p>
          </div>

        </section>

      </div>

      {/* Footer System HUD */}
      <footer className="h-12 border-t border-[#1A1A1A] flex items-center justify-between px-6 md:px-10 bg-[#080808] text-[9px] text-[#444] uppercase tracking-widest">
        <span>© Selvia</span>
      </footer>

    </div>
  );
}
