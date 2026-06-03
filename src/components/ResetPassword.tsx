import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface ResetPasswordProps {
  onBack: () => void;
}

export default function ResetPassword({ onBack }: ResetPasswordProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-sans select-none relative justify-center">
      
      {/* Top Navigation */}
      <header className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="text-[#666] hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Back</span>
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        {/* Reset Password Card */}
        <div className="w-full max-w-sm bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-8 relative overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col items-center text-center">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center"
              >
                {/* Visual Icon */}
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                  <RotateCcw className="w-6 h-6 text-white/80" />
                </div>

                {/* Headers */}
                <h1 className="font-serif text-2xl font-light italic text-white tracking-widest mb-1.5">
                  Reset password
                </h1>
                <p className="text-[11px] text-[#666] tracking-wide mb-6 uppercase max-w-[280px]">
                  Provide your email address to receive password recovery instructions.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-none leading-relaxed text-center">
                      {errorMsg}
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="flex flex-col text-left">
                    <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555] mb-2 px-0.5 ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#444] w-4 h-4" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#070707] border border-[#1A1A1A] rounded-none py-3 pl-11 pr-4 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-white transition-colors"
                        placeholder="name@domain.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-white text-black font-headline font-semibold text-xs uppercase tracking-[0.2em] py-3.5 rounded-none hover:bg-neutral-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Send reset link</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center py-4"
              >
                {/* Sealed Checkmark Success logo */}
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
                  <CheckIcon />
                </div>

                <h1 className="font-serif text-2xl font-light italic text-white tracking-widest mb-1.5">
                  Reset link sent
                </h1>
                <p className="text-[11px] text-[#666] tracking-wide mb-6 uppercase max-w-[280px]">
                  Recovery instructions have been sent to <span className="text-white lower-case font-medium">{email}</span>. Please verify your inbox to reset your password.
                </p>

                <button
                  onClick={onBack}
                  className="w-full bg-[#111] hover:bg-[#1A1A1A] text-white border border-[#222] font-mono text-[10px] uppercase tracking-[0.2em] py-3.5 rounded-none transition-all active:scale-95 duration-200 cursor-pointer"
                >
                  Return to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </main>
    </div>
  );
}

// Inline pure white check representational SVG to match design aesthetic
function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
