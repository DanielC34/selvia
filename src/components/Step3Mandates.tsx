import { useState, useEffect, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Activity, BookOpen, Hammer, Plus, Trash2 } from 'lucide-react';
import { CategoryMandates, MandateItem } from '../types';

interface Step3Props {
  initialMandates: CategoryMandates;
  onBack: () => void;
  onConfirm: (mandates: CategoryMandates) => void;
}

export default function Step3Mandates({ initialMandates, onBack, onConfirm }: Step3Props) {
  const [mandates, setMandates] = useState<CategoryMandates>(initialMandates);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    spiritualInput: '',
    physicalInput: '',
    intellectInput: '',
    builderInput: '',
  });

  // Clear validation error when commitments change
  useEffect(() => {
    setValidationError(null);
  }, [mandates]);

  // Handle toggling checkbox status
  const handleToggle = (category: keyof CategoryMandates, id: string) => {
    setMandates((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  // Add custom manual mandate
  const handleAddCustom = (category: keyof CategoryMandates, inputKey: keyof typeof inputs) => {
    const text = inputs[inputKey].trim();
    if (!text) return;

    const newItem: MandateItem = {
      id: `${category}-${Date.now()}`,
      name: text,
      completed: true,
      isCustom: true,
    };

    setMandates((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem],
    }));

    setInputs((prev) => ({
      ...prev,
      [inputKey]: '',
    }));
  };

  const handleKeyPress = (
    e: KeyboardEvent,
    category: keyof CategoryMandates,
    inputKey: keyof typeof inputs
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom(category, inputKey);
    }
  };

  // Remove custom mandate
  const handleRemoveCustom = (category: keyof CategoryMandates, id: string) => {
    setMandates((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  const handleNext = () => {
    // Validate we have at least one mandate checked across categories
    const totalSelected = (Object.values(mandates) as MandateItem[][]).flatMap((list) => list.filter((i) => i.completed)).length;
    if (totalSelected === 0) {
      setValidationError('Please establish at least one active commitment to proceed.');
      return;
    }

    if (navigator.vibrate) {
      navigator.vibrate(35);
    }
    onConfirm(mandates);
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
            <span className="text-[10px] uppercase tracking-widest text-[#666]">Step 03 of 04</span>
            <span className="text-xs font-medium text-[#AAA]">Mandates Setup</span>
          </div>
          <div className="w-24 h-1 bg-[#1A1A1A] rounded-full overflow-hidden hidden sm:block">
            <div className="w-3/4 h-full bg-[#E0E0E0]"></div>
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
            
            <div className="flex items-center gap-4 opacity-30">
              <div className="w-6 h-6 rounded-full border border-[#444] flex items-center justify-center text-[10px] font-mono">02</div>
              <span className="text-sm">Identity Focus</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold font-mono">03</div>
              <span className="text-sm font-semibold text-white italic font-serif">Daily Mandates</span>
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

        {/* Right Mandates Customizer Grid Content */}
        <section className="flex-1 bg-[#070707] p-6 sm:p-10 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-3xl w-full mx-auto text-center mb-8">
            <h1 className="text-3xl sm:text-4xl mb-3 font-light text-white font-serif italic">Set your daily commitments</h1>
            <p className="text-[#888] text-xs sm:text-sm tracking-wide p-1 max-w-lg mx-auto">
              Select or create the simple daily tasks you will track.
            </p>
          </div>

          {/* Categories 2x2 Grid of Mandates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mx-auto mb-8">
            
            {/* Category: Spiritual */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 rounded-lg flex flex-col relative transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b border-[#1A1A1A]/30">
                <Sparkles className="w-4 h-4 text-[#888]" />
                <div>
                  <h3 className="font-serif italic text-sm text-white font-semibold">Spiritual</h3>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 mb-4 flex-1">
                {mandates.spiritual.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group/item">
                    <label className="flex items-center gap-3 cursor-pointer select-none py-0.5 flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggle('spiritual', item.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                        item.completed ? 'bg-white border-white text-black' : 'border-[#333] bg-transparent text-transparent'
                      }`}>
                        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <span className={`text-xs font-sans transition-colors ${
                        item.completed ? 'text-white font-medium' : 'text-[#555]'
                      }`}>
                        {item.name}
                      </span>
                    </label>
                    {item.isCustom && (
                      <button
                        onClick={() => handleRemoveCustom('spiritual', item.id)}
                        className="text-[#444] hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Underlined Quick Add */}
              <div className="relative group">
                <input
                  type="text"
                  value={inputs.spiritualInput}
                  onChange={(e) => setInputs((prev) => ({ ...prev, spiritualInput: e.target.value }))}
                  onKeyDown={(e) => handleKeyPress(e, 'spiritual', 'spiritualInput')}
                  className="w-full bg-transparent border-b border-[#1A1A1A] py-1.5 pr-8 text-xs font-sans text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-colors"
                  placeholder="Add item..."
                />
                <button
                  onClick={() => handleAddCustom('spiritual', 'spiritualInput')}
                  className="absolute right-0 bottom-1.5 text-[#555] hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category: Physical */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 rounded-lg flex flex-col relative transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b border-[#1A1A1A]/30">
                <Activity className="w-4 h-4 text-[#888]" />
                <div>
                  <h3 className="font-serif italic text-sm text-white font-semibold">Physical</h3>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 mb-4 flex-1">
                {mandates.physical.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group/item">
                    <label className="flex items-center gap-3 cursor-pointer select-none py-0.5 flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggle('physical', item.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                        item.completed ? 'bg-white border-white text-black' : 'border-[#333] bg-transparent text-transparent'
                      }`}>
                        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <span className={`text-xs font-sans transition-colors ${
                        item.completed ? 'text-white font-medium' : 'text-[#555]'
                      }`}>
                        {item.name}
                      </span>
                    </label>
                    {item.isCustom && (
                      <button
                        onClick={() => handleRemoveCustom('physical', item.id)}
                        className="text-[#444] hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Underlined Quick Add */}
              <div className="relative group">
                <input
                  type="text"
                  value={inputs.physicalInput}
                  onChange={(e) => setInputs((prev) => ({ ...prev, physicalInput: e.target.value }))}
                  onKeyDown={(e) => handleKeyPress(e, 'physical', 'physicalInput')}
                  className="w-full bg-transparent border-b border-[#1A1A1A] py-1.5 pr-8 text-xs font-sans text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-colors"
                  placeholder="Add item..."
                />
                <button
                  onClick={() => handleAddCustom('physical', 'physicalInput')}
                  className="absolute right-0 bottom-1.5 text-[#555] hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category: Intellect */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 rounded-lg flex flex-col relative transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b border-[#1A1A1A]/30">
                <BookOpen className="w-4 h-4 text-[#888]" />
                <div>
                  <h3 className="font-serif italic text-sm text-white font-semibold">Mental</h3>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 mb-4 flex-1">
                {mandates.intellect.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group/item">
                    <label className="flex items-center gap-3 cursor-pointer select-none py-0.5 flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggle('intellect', item.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                        item.completed ? 'bg-white border-white text-black' : 'border-[#333] bg-transparent text-transparent'
                      }`}>
                        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <span className={`text-xs font-sans transition-colors ${
                        item.completed ? 'text-white font-medium' : 'text-[#555]'
                      }`}>
                        {item.name}
                      </span>
                    </label>
                    {item.isCustom && (
                      <button
                        onClick={() => handleRemoveCustom('intellect', item.id)}
                        className="text-[#444] hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Underlined Quick Add */}
              <div className="relative group">
                <input
                  type="text"
                  value={inputs.intellectInput}
                  onChange={(e) => setInputs((prev) => ({ ...prev, intellectInput: e.target.value }))}
                  onKeyDown={(e) => handleKeyPress(e, 'intellect', 'intellectInput')}
                  className="w-full bg-transparent border-b border-[#1A1A1A] py-1.5 pr-8 text-xs font-sans text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-colors"
                  placeholder="Add item..."
                />
                <button
                  onClick={() => handleAddCustom('intellect', 'intellectInput')}
                  className="absolute right-0 bottom-1.5 text-[#555] hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category: Builder */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-5 rounded-lg flex flex-col relative transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-4 pb-2.5 border-b border-[#1A1A1A]/30">
                <Hammer className="w-4 h-4 text-[#888]" />
                <div>
                  <h3 className="font-serif italic text-sm text-white font-semibold">Career</h3>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2.5 mb-4 flex-1">
                {mandates.builder.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group/item">
                    <label className="flex items-center gap-3 cursor-pointer select-none py-0.5 flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggle('builder', item.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border flex items-center justify-center transition-all ${
                        item.completed ? 'bg-white border-white text-black' : 'border-[#333] bg-transparent text-transparent'
                      }`}>
                        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <span className={`text-xs font-sans transition-colors ${
                        item.completed ? 'text-white font-medium' : 'text-[#555]'
                      }`}>
                        {item.name}
                      </span>
                    </label>
                    {item.isCustom && (
                      <button
                        onClick={() => handleRemoveCustom('builder', item.id)}
                        className="text-[#444] hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Underlined Quick Add */}
              <div className="relative group">
                <input
                  type="text"
                  value={inputs.builderInput}
                  onChange={(e) => setInputs((prev) => ({ ...prev, builderInput: e.target.value }))}
                  onKeyDown={(e) => handleKeyPress(e, 'builder', 'builderInput')}
                  className="w-full bg-transparent border-b border-[#1A1A1A] py-1.5 pr-8 text-xs font-sans text-white placeholder:text-[#444] focus:outline-none focus:border-white transition-colors"
                  placeholder="Add item..."
                />
                <button
                  onClick={() => handleAddCustom('builder', 'builderInput')}
                  className="absolute right-0 bottom-1.5 text-[#555] hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Action HUD Buttons */}
          <div className="w-full max-w-xs mx-auto text-center flex flex-col items-center gap-2 pt-2">
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-3 bg-yellow-950/20 border border-yellow-500/20 text-yellow-500 text-[10px] font-mono uppercase tracking-widest rounded-lg mb-2"
              >
                {validationError}
              </motion.div>
            )}
            <button
              onClick={handleNext}
              className="w-full bg-white text-black font-headline font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-none hover:bg-neutral-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Save Commitments</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-2 text-[10px] text-[#444] uppercase tracking-widest hidden sm:block">
              Confirm your daily checklist
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
