import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, securityKey: string) => boolean | string; // returns true if success, or error message string
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  onNavigateWelcome: () => void;
}

export default function Login({
  onLogin,
  onNavigateRegister,
  onNavigateForgotPassword,
  onNavigateWelcome
}: LoginProps) {
  const [email, setEmail] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    if (!email.trim() || !securityKey.trim()) {
      setErrorMsg('Please state your character descriptors completely.');
      return;
    }

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    const result = onLogin(email, securityKey);
    if (result === true) {
      setSuccess(true);
    } else {
      setErrorMsg(typeof result === 'string' ? result : 'Error validating credentials.');
    }
  };

  const handleDemoFill = () => {
    setEmail('dominocheese31@gmail.com');
    setSecurityKey('disciplined_character_2026');
  };

  return (
    <div className="min-h-screen text-[#E0E0E0] flex flex-col items-center justify-center relative overflow-x-hidden font-sans bg-[#050505] p-6 select-none">
      
      {/* Back button container */}
      <header className="absolute top-6 left-6 z-10">
        <button
          onClick={onNavigateWelcome}
          className="text-[#666] hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Back</span>
        </button>
      </header>

      <main className="w-full max-w-sm z-10 flex flex-col items-center justify-center min-h-[85vh]">
        {/* Core Header Layout */}
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-light italic text-white tracking-widest mb-1.5">Selvia</h1>
          <p className="text-[10px] text-[#666] uppercase tracking-[0.2em]">Resume identity</p>
        </div>

        {/* Login Box Panel */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] w-full rounded-lg p-8 relative overflow-hidden transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error notifications */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-none leading-relaxed text-center"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Success feedback */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-none leading-relaxed text-center"
              >
                Welcome back.
              </motion.div>
            )}

            {/* Input 1: Email designation */}
            <div className="flex flex-col text-left">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555] mb-2 px-0.5" htmlFor="email">
                Email address
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

            {/* Input 2: Security Key */}
            <div className="flex flex-col text-left">
              <div className="flex justify-between items-center mb-2 px-0.5">
                <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555]" htmlFor="password">
                  Security Key
                </label>
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="text-[9px] font-mono uppercase tracking-wider text-[#555] hover:text-white transition-colors cursor-pointer"
                >
                  Retrieve
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#444] w-4 h-4" />
                <input
                  type="password"
                  id="password"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  className="w-full bg-[#070707] border border-[#1A1A1A] rounded-none py-3 pl-11 pr-4 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-white transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Main sign-in link buttons */}
            <button
              type="submit"
              className="w-full bg-white text-black font-headline font-semibold text-xs uppercase tracking-[0.2em] py-3.5 rounded-none hover:bg-neutral-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Quick Demo Assist Tooltip */}
          <div className="mt-6 border-t border-[#111] pt-4 flex flex-col justify-center items-center text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[9px] font-mono uppercase tracking-wider text-[#888] hover:text-white transition-colors cursor-pointer block border border-[#1a1a1a] px-3.5 py-1.5 bg-[#0c0c0c] rounded-none"
            >
              Fill Demo Credentials
            </button>
            <p className="text-[9px] text-[#444] mt-2 uppercase tracking-wide">Fill credentials to sign in to demo account</p>
          </div>

          <div className="mt-5 text-center">
            <p className="font-sans text-[11px] text-[#555]">
              New entity?{' '}
              <button
                onClick={onNavigateRegister}
                className="text-white hover:underline underline-offset-4 font-medium transition-all cursor-pointer font-sans"
              >
                Register
              </button>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
