import { motion } from 'motion/react';
import { 
  Flame, 
  Award, 
  Dumbbell, 
  Lock, 
  Activity, 
  Sparkles, 
  BookOpen, 
  CheckCircle 
} from 'lucide-react';
import { UserProfile } from '../types';

interface JourneyViewProps {
  userProfile: UserProfile;
}

export default function JourneyView({ userProfile }: JourneyViewProps) {
  
  // Custom week representation mock based on actual user momentum
  const weeklyData = [
    { day: 'M', value: 80, active: false },
    { day: 'T', value: 65, active: false },
    { day: 'W', value: 0, active: false }, // slip day represented as blank
    { day: 'T', value: 90, active: false },
    { day: 'F', value: 100, active: true }, // Highlighted as Friday/Today
    { day: 'S', value: 50, active: false },
    { day: 'S', value: 30, active: false }
  ];

  // Milestones listing
  const milestones = [
    {
      id: 'ms-1',
      title: 'Meditation Loop',
      description: 'Completed 30 sessions.',
      timeago: '2d ago',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      locked: false
    },
    {
      id: 'ms-2',
      title: 'Training Loop',
      description: '10 sessions in a weekly loop.',
      timeago: '1w ago',
      icon: <Dumbbell className="w-5 h-5 text-emerald-400" />,
      locked: false
    },
    {
      id: 'ms-3',
      title: 'Focus Level',
      description: 'Reaches at level 30.',
      timeago: '',
      icon: <Lock className="w-5 h-5 text-white/20" />,
      locked: true
    }
  ];

  return (
    <div className="space-y-8 pb-12 select-none">
      
      {/* Title descriptors */}
      <section className="space-y-1 mt-4">
        <h2 className="font-serif italic font-light text-2xl text-white tracking-wide">
          Journey
        </h2>
        <p className="text-xs text-[#888] uppercase tracking-wider">
          Consistency checks and milestone records.
        </p>
      </section>

      {/* Weekly Flow Rounded Bar Chart */}
      <section className="bg-[#0A0A0A] border border-[#141414] rounded-lg p-6 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        
        <div className="flex justify-between items-center pb-2 border-b border-[#141414]">
          <h3 className="font-sans text-sm font-semibold text-white tracking-wide leading-none">
            Weekly consistency
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#888]">
              Current Streak: <strong className="text-white">{userProfile.streak} Days</strong>
            </span>
            <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Custom rounded columns chart */}
        <div className="flex justify-between items-end h-32 pt-4 px-1">
          {weeklyData.map((d, index) => (
            <div key={index} className="flex flex-col items-center gap-3 w-1/8">
              
              {/* Vertical Bar */}
              <div className="w-7 h-24 bg-[#0E0E0E] rounded-full overflow-hidden flex items-end border border-white/[0.02]">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.value}%` }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  className={`w-full rounded-full ${
                    d.active 
                      ? 'bg-gradient-to-t from-emerald-500/80 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                      : d.value > 0 
                      ? 'bg-gradient-to-t from-white/10 to-white/30' 
                      : 'bg-transparent'
                  }`}
                />
              </div>

              {/* Day Letter */}
              <span className={`text-[10px] font-mono font-bold leading-none ${
                d.active ? 'text-emerald-400' : 'text-[#666]'
              }`}>
                {d.day}
              </span>

            </div>
          ))}
        </div>

      </section>

      {/* Monthly Momentum SVG Line Graph */}
      <section className="bg-[#0A0A0A] border border-[#141414] rounded-lg p-6 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        
        <div className="flex justify-between items-center pb-1 border-b border-[#141414]">
          <h3 className="font-sans text-sm font-semibold text-white tracking-wide leading-none">
            Monthly consistency
          </h3>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#666]">
            Progress logging
          </span>
        </div>

        {/* Line Spline chart mapped on SVG viewbox */}
        <div className="relative pt-6 h-36">
          
          {/* Legend metadata badge overlays */}
          <div className="absolute top-2 left-2 text-left">
            <span className="font-mono text-xs font-bold text-white/50 block">
              +{userProfile.level > 2 ? '4,200' : '820'} XP
            </span>
          </div>

          <div className="absolute top-1 right-[20%]">
            <span className="text-[9px] font-mono tracking-widest text-[#FFF] bg-white/5 border border-white/10 px-2 py-0.5 rounded-none font-bold uppercase shadow-md">
              NOV
            </span>
          </div>

          {/* Bezier Sine path */}
          <div className="w-full h-24">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              
              {/* Area fill path underneath line */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <path
                d="M 0 25 Q 25 10, 50 20 T 80 5 Q 90 10, 100 15 L 100 30 L 0 30 Z"
                fill="url(#chartGradient)"
              />

              {/* Foreground smooth curve spline */}
              <motion.path
                d="M 0 25 Q 25 10, 50 20 T 80 5 Q 90 10, 100 15"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />

              {/* Interactive target peak node item */}
              <circle cx="80" cy="5" r="2" fill="white" className="animate-ping" style={{ transformOrigin: '80px 5px' }} />
              <circle cx="80" cy="5" r="1.5" fill="white" />
            </svg>
          </div>

        </div>

      </section>

      {/* Recent Milestones Progress list */}
      <section className="space-y-4">
        
        <div className="flex items-center gap-2 pb-1 border-b border-[#141414]">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#555] font-semibold">
            Recent recognitions
          </span>
        </div>

        <div className="space-y-3">
          {milestones.map((ms) => (
            <div 
              key={ms.id}
              className={`p-4 rounded-lg border  flex items-center justify-between transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.6)] ${
                ms.locked 
                  ? 'border-[#121212] bg-[#070707] opacity-60' 
                  : 'border-[#151515] bg-[#0A0A0A] hover:bg-[#0c0c0c] hover:border-white/10'
              }`}
            >
              
              <div className="flex items-center gap-4 truncate">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                  ms.locked ? 'border-[#1A1A1A] bg-transparent' : 'border-[#1F1F1F] bg-white/[0.02]'
                }`}>
                  {ms.icon}
                </div>
                <div className="truncate">
                  <h4 className={`text-sm font-semibold tracking-wide font-sans ${
                    ms.locked ? 'text-[#555]' : 'text-white'
                  }`}>
                    {ms.title}
                  </h4>
                  <p className={`text-[11px] font-sans mt-0.5 block truncate ${
                    ms.locked ? 'text-[#444]' : 'text-[#888]'
                  }`}>
                    {ms.description}
                  </p>
                </div>
              </div>

              {ms.timeago && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#555] pl-3 whitespace-nowrap">
                  {ms.timeago}
                </span>
              )}

            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
