import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface RegisterProps {
  onRegister: (moniker: string, email: string, securityKey: string) => boolean | string; // returns true or error message string
  onNavigateLogin: () => void;
  onNavigateWelcome: () => void;
}

export default function Register({
  onRegister,
  onNavigateLogin,
  onNavigateWelcome
}: RegisterProps) {
  const [moniker, setMoniker] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Floating Label States (for input-underline styling matching design spec)
  const [focusFields, setFocusFields] = useState({
    moniker: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleFocus = (field: keyof typeof focusFields) => {
    setFocusFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof typeof focusFields, value: string) => {
    if (value.trim() === '') {
      setFocusFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    if (!email.trim()) {
      setErrorMsg('Please specify your communication email.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Security key must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Verify descriptors. Password confirmation key does not match.');
      return;
    }

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    const result = onRegister(moniker, email, password);
    if (result === true) {
      setSuccess(true);
    } else {
      setErrorMsg(typeof result === 'string' ? result : 'Error constructing identity.');
    }
  };

  return (
    <div className="min-h-screen text-[#E0E0E0] flex flex-col items-center justify-center relative overflow-x-hidden font-sans bg-[#050505] p-6 select-none">
      
      {/* Back button */}
      <header className="absolute top-6 left-6 z-10">
        <button
          onClick={onNavigateWelcome}
          className="text-[#666] hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Back</span>
        </button>
      </header>

      <main className="w-full max-w-sm z-10 flex flex-col items-center justify-center min-h-[85vh] pt-10">
        {/* Headings */}
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-light italic text-white tracking-widest mb-1.5">Selvia</h1>
          <p className="text-[10px] text-[#666] uppercase tracking-[0.2em]">Create your profile</p>
        </div>

        {/* Input underline card layout */}
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

            {/* Success message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-none leading-relaxed text-center"
              >
                Profile created.
              </motion.div>
            )}

            {/* Field 1: Name / Moniker */}
            <div className="flex flex-col text-left">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555] mb-2 px-0.5" htmlFor="name">
                Name <span className="opacity-50 text-[8px] lowercase">(optional)</span>
              </label>
              <input
                type="text"
                id="name"
                value={moniker}
                onChange={(e) => setMoniker(e.target.value)}
                className="w-full bg-[#070707] border border-[#1A1A1A] rounded-none py-3 px-4 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-white transition-colors"
                placeholder="e.g. Marcus Aurelius"
              />
            </div>

            {/* Field 2: Email */}
            <div className="flex flex-col text-left">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555] mb-2 px-0.5" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070707] border border-[#1A1A1A] rounded-none py-3 px-4 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-white transition-colors"
                placeholder="name@domain.com"
                required
              />
            </div>

            {/* Field 3: Password */}
            <div className="flex flex-col text-left">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555] mb-2 px-0.5" htmlFor="password">
                Security Key
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070707] border border-[#1A1A1A] rounded-none py-3 px-4 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-white transition-colors"
                placeholder="•••••••• (Min 6 chars)"
                required
              />
            </div>

            {/* Field 4: Confirm password */}
            <div className="flex flex-col text-left">
              <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#555] mb-2 px-0.5" htmlFor="confirm_password">
                Confirm Security Key
              </label>
              <input
                type="password"
                id="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#070707] border border-[#1A1A1A] rounded-none py-3 px-4 text-xs text-white placeholder:text-[#333] focus:outline-none focus:border-white transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Create Identity Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-white text-black font-headline font-semibold text-xs uppercase tracking-[0.2em] py-3.5 rounded-none hover:bg-neutral-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* Login alternate link */}
          <div className="mt-6 text-center border-t border-[#111] pt-4">
            <p className="font-sans text-[11px] text-[#555]">
              Already have an identity?{' '}
              <button
                onClick={onNavigateLogin}
                className="text-white hover:underline underline-offset-4 font-medium transition-all cursor-pointer font-sans"
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
