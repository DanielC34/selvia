import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Splash from './components/Splash';
import Welcome from './components/Welcome';
import Step2Identity from './components/Step2Identity';
import Step3Mandates from './components/Step3Mandates';
import Step4Confirm from './components/Step4Confirm';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';

import { AppScreen, UserProfile, CategoryMandates } from './types';

// Default templated daily mandates used to construct initial state draft
const getInitialMandatesDraft = (): CategoryMandates => ({
  spiritual: [
    { id: 'sp-1', name: '10m Meditation', completed: true },
    { id: 'sp-2', name: 'Morning Journaling', completed: false }
  ],
  physical: [
    { id: 'ph-1', name: '45m Rigorous Training', completed: true },
    { id: 'ph-2', name: '10k Steps Minimum', completed: false }
  ],
  intellect: [
    { id: 'in-1', name: '20 Pages Reading', completed: true },
    { id: 'in-2', name: '1 Hour Deep Study', completed: false }
  ],
  builder: [
    { id: 'bu-1', name: '90m Deep Work Block', completed: true },
    { id: 'bu-2', name: 'Learn New Skill (30m)', completed: false }
  ]
});

const CURRENT_STATE_VERSION = 1;

// Migrate and validate loaded profile schemas dynamically to prevent key parameter corruption during updates
export function migrateProfile(raw: any): UserProfile {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid raw profile structure');
  }

  const systemDate = new Date();
  const todayStr = systemDate.getFullYear() + '-' + String(systemDate.getMonth() + 1).padStart(2, '0') + '-' + String(systemDate.getDate()).padStart(2, '0');

  const defaultMandates = getInitialMandatesDraft();
  const defaultActions = [
    { id: 'act-sp', category: 'spiritual' as const, name: 'Morning Meditation (20m)', completed: false, xpValue: 100 },
    { id: 'act-ph', category: 'physical' as const, name: 'Strength Training', completed: false, xpValue: 100 },
    { id: 'act-rd', category: 'reading' as const, name: 'Stoic Philosophy (15 pgs)', completed: false, xpValue: 100 },
    { id: 'act-cr', category: 'career' as const, name: 'Deep Work Block (2h)', completed: false, xpValue: 100 },
    { id: 'act-bu', category: 'builder' as const, name: 'Side Project Commits', completed: false, xpValue: 100 }
  ];

  const migrated: UserProfile = {
    email: typeof raw.email === 'string' ? raw.email.trim() : 'anonymous@selvia.app',
    name: typeof raw.name === 'string' ? raw.name.trim() : 'Architect of Value',
    password: typeof raw.password === 'string' ? raw.password : 'disciplined_character_2026',
    archetypeId: typeof raw.archetypeId === 'string' ? raw.archetypeId : 'disciplined_builder',
    customArchetypeText: typeof raw.customArchetypeText === 'string' ? raw.customArchetypeText : '',
    onboardingCompleted: !!raw.onboardingCompleted,
    streak: typeof raw.streak === 'number' && !isNaN(raw.streak) ? Math.max(0, raw.streak) : 1,
    lifetimeXp: typeof raw.lifetimeXp === 'number' && !isNaN(raw.lifetimeXp) ? Math.max(0, raw.lifetimeXp) : 0,
    xpToday: typeof raw.xpToday === 'number' && !isNaN(raw.xpToday) ? Math.max(0, raw.xpToday) : 0,
    level: typeof raw.level === 'number' && !isNaN(raw.level) ? Math.max(1, raw.level) : 1,
    unlockedAchievements: Array.isArray(raw.unlockedAchievements) ? raw.unlockedAchievements : [],
    
    mandates: (raw.mandates && typeof raw.mandates === 'object') ? {
      spiritual: Array.isArray(raw.mandates.spiritual) ? raw.mandates.spiritual : defaultMandates.spiritual,
      physical: Array.isArray(raw.mandates.physical) ? raw.mandates.physical : defaultMandates.physical,
      intellect: Array.isArray(raw.mandates.intellect) ? raw.mandates.intellect : defaultMandates.intellect,
      builder: Array.isArray(raw.mandates.builder) ? raw.mandates.builder : defaultMandates.builder
    } : defaultMandates,

    dailyActions: Array.isArray(raw.dailyActions) ? raw.dailyActions.map((act: any, idx: number) => ({
      id: typeof act.id === 'string' ? act.id : `act-safe-${idx}`,
      category: ['spiritual', 'physical', 'reading', 'career', 'builder'].includes(act.category) 
        ? act.category 
        : defaultActions[idx % defaultActions.length].category,
      name: typeof act.name === 'string' ? act.name : 'Daily Task',
      completed: !!act.completed,
      xpValue: typeof act.xpValue === 'number' ? act.xpValue : 100
    })) : defaultActions,

    reflections: Array.isArray(raw.reflections) ? raw.reflections.map((ref: any) => ({
      date: typeof ref.date === 'string' ? ref.date : todayStr,
      build: typeof ref.build === 'string' ? ref.build : '',
      learn: typeof ref.learn === 'string' ? ref.learn : '',
      gratitude: typeof ref.gratitude === 'string' ? ref.gratitude : '',
      submitted: !!ref.submitted
    })) : [],

    categoryXp: (raw.categoryXp && typeof raw.categoryXp === 'object') ? {
      spiritual: typeof raw.categoryXp.spiritual === 'number' ? raw.categoryXp.spiritual : 0,
      physical: typeof raw.categoryXp.physical === 'number' ? raw.categoryXp.physical : 0,
      reading: typeof raw.categoryXp.reading === 'number' ? raw.categoryXp.reading : 0,
      career: typeof raw.categoryXp.career === 'number' ? raw.categoryXp.career : 0,
      builder: typeof raw.categoryXp.builder === 'number' ? raw.categoryXp.builder : 0
    } : { spiritual: 0, physical: 0, reading: 0, career: 0, builder: 0 },

    categoryStreaks: (raw.categoryStreaks && typeof raw.categoryStreaks === 'object') ? {
      spiritual: typeof raw.categoryStreaks.spiritual === 'number' ? raw.categoryStreaks.spiritual : 0,
      physical: typeof raw.categoryStreaks.physical === 'number' ? raw.categoryStreaks.physical : 0,
      reading: typeof raw.categoryStreaks.reading === 'number' ? raw.categoryStreaks.reading : 0,
      career: typeof raw.categoryStreaks.career === 'number' ? raw.categoryStreaks.career : 0,
      builder: typeof raw.categoryStreaks.builder === 'number' ? raw.categoryStreaks.builder : 0
    } : { spiritual: 0, physical: 0, reading: 0, career: 0, builder: 0 },

    lastActiveDate: typeof raw.lastActiveDate === 'string' ? raw.lastActiveDate : todayStr,
    lastCompletedDate: typeof raw.lastCompletedDate === 'string' ? raw.lastCompletedDate : undefined,
    storedDayKey: typeof raw.storedDayKey === 'string' ? raw.storedDayKey : todayStr,
    stateVersion: CURRENT_STATE_VERSION
  };

  return migrated;
}

// Seed static credentials inside localStorage so reviewers have immediate login access
const seedDemoDatabase = () => {
  const registeredAccountsStr = localStorage.getItem('selvia_accounts');
  
  const demoProfile: UserProfile = {
    email: 'dominocheese31@gmail.com',
    name: 'Architect of Value',
    password: 'disciplined_character_2026',
    archetypeId: 'disciplined_builder',
    onboardingCompleted: true,
    streak: 14,
    mandates: getInitialMandatesDraft(),
    lifetimeXp: 124500,
    xpToday: 450,
    level: 24,
    dailyActions: [
      { id: 'act-sp', category: 'spiritual', name: 'Morning Meditation (20m)', completed: true, xpValue: 100 },
      { id: 'act-ph', category: 'physical', name: 'Strength Training', completed: true, xpValue: 100 },
      { id: 'act-rd', category: 'reading', name: 'Stoic Philosophy (15 pgs)', completed: false, xpValue: 100 },
      { id: 'act-cr', category: 'career', name: 'Deep Work Block (2h)', completed: true, xpValue: 100 },
      { id: 'act-bu', category: 'builder', name: 'Side Project Commits', completed: true, xpValue: 100 }
    ],
    reflections: [
      {
        date: new Date(Date.now() - 86400050).toISOString().split('T')[0],
        build: 'Sutured progressive structures with unified layout controls',
        learn: 'Understood Tailwind high contrast color boundaries',
        gratitude: 'Grateful for clean and pristine screen architectures',
        submitted: true
      }
    ],
    unlockedAchievements: ['ach-7day', 'ach-30workout', 'ach-100session'],
    categoryXp: { spiritual: 1500, physical: 3200, reading: 2800, career: 4100, builder: 3500 },
    categoryStreaks: { spiritual: 15, physical: 32, reading: 28, career: 41, builder: 35 },
    stateVersion: CURRENT_STATE_VERSION
  };

  if (!registeredAccountsStr) {
    localStorage.setItem('selvia_accounts', JSON.stringify([migrateProfile(demoProfile)]));
  } else {
    // Merge demo profile if not already present so it's always testable
    try {
      const parsed: UserProfile[] = JSON.parse(registeredAccountsStr);
      const migratedAccounts = parsed.map(u => {
        try {
          return migrateProfile(u);
        } catch {
          return u;
        }
      });
      if (!migratedAccounts.some(acc => acc.email === demoProfile.email)) {
        migratedAccounts.push(migrateProfile(demoProfile));
      }
      localStorage.setItem('selvia_accounts', JSON.stringify(migratedAccounts));
    } catch {
      localStorage.setItem('selvia_accounts', JSON.stringify([migrateProfile(demoProfile)]));
    }
  }
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('SPLASH');
  
  // Transient state for draft profile building during step 1-4 sequences
  const [draftArchetype, setDraftArchetype] = useState<string>('disciplined_builder');
  const [draftCustomText, setDraftCustomText] = useState<string>('');
  const [draftMandates, setDraftMandates] = useState<CategoryMandates>(getInitialMandatesDraft());

  // Current authenticated user session state
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);

  // Transient state to track if user completed Step 4 and is completing onboarding
  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState<boolean>(false);

  // Initialize and check active session
  useEffect(() => {
    seedDemoDatabase();

    // Check if user is already authenticated
    const savedActiveSession = localStorage.getItem('selvia_active_session');
    if (savedActiveSession) {
      try {
        const parsedProfile = JSON.parse(savedActiveSession);
        const migrated = migrateProfile(parsedProfile);
        setActiveUser(migrated);
        localStorage.setItem('selvia_active_session', JSON.stringify(migrated));
        
        if (migrated.onboardingCompleted) {
          // Skip onboarding splash directly into progression home
          setScreen('HOME');
          return;
        }
      } catch {
        localStorage.removeItem('selvia_active_session');
      }
    }

    // Default entry to Splash overlay
    setScreen('SPLASH');
  }, []);

  // Guard routing: if user is logged in and onboarding is completed, prevent accessing onboarding screens
  useEffect(() => {
    if (activeUser?.onboardingCompleted && screen !== 'HOME') {
      setScreen('HOME');
    }
  }, [activeUser, screen]);

  // Syncing active-user updates to state and local storage databases
  const handleUpdateUserProfile = (updatedProfile: UserProfile) => {
    try {
      const sanitized = migrateProfile(updatedProfile);
      setActiveUser(sanitized);
      localStorage.setItem('selvia_active_session', JSON.stringify(sanitized));

      // Also update account index database so it persists across logouts
      const savedAccounts = localStorage.getItem('selvia_accounts');
      if (savedAccounts) {
        try {
          const parsed: UserProfile[] = JSON.parse(savedAccounts);
          const updatedList = parsed.map(u => u.email === sanitized.email ? sanitized : u);
          localStorage.setItem('selvia_accounts', JSON.stringify(updatedList));
        } catch (err) {
          console.error('Core registry update failure:', err);
        }
      }
    } catch (err) {
      console.error('Corrupted profile update blocked:', err);
      // Fallback update
      setActiveUser(updatedProfile);
      localStorage.setItem('selvia_active_session', JSON.stringify(updatedProfile));
    }
  };

  // Log in existing registry user
  const handleLoginUser = (email: string, securityKey: string): boolean | string => {
    const savedAccounts = localStorage.getItem('selvia_accounts');
    if (!savedAccounts) {
      return 'Account index empty. Please create a new identity first.';
    }

    try {
      const parsed: UserProfile[] = JSON.parse(savedAccounts);
      const RawMatch = parsed.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (!RawMatch) {
        return 'Identity coordinates unregistered. Construct identity first.';
      }

      const match = migrateProfile(RawMatch);

      if (match.password !== securityKey) {
        return 'Cryptographic key invalid. Verify descriptors.';
      }

      // Log in success
      setActiveUser(match);
      localStorage.setItem('selvia_active_session', JSON.stringify(match));
      
      if (match.onboardingCompleted) {
        setScreen('HOME');
      } else {
        // Resume incomplete profile sequence at step 2
        setScreen('STEP_2_IDENTITY');
      }
      return true;
    } catch {
      return 'Critical error parsing registration coordinates.';
    }
  };

  // Register new user profile record
  const handleRegisterUser = (moniker: string, email: string, securityKey: string): boolean | string => {
    const savedAccounts = localStorage.getItem('selvia_accounts');
    const existingAccounts: UserProfile[] = savedAccounts ? JSON.parse(savedAccounts) : [];

    const conflict = existingAccounts.some(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (conflict) {
      return 'Identity email designating coordinate is already registered.';
    }

    // Merge draft onboarding progress if we are in draft sequence
    const newRaw: any = {
      email: email.trim(),
      name: moniker.trim() || 'Anonymous Monk',
      password: securityKey,
      archetypeId: draftArchetype,
      customArchetypeText: draftCustomText,
      mandates: draftMandates,
      onboardingCompleted: isCompletingOnboarding, // Completing step 4 transitions it
      streak: 1,
      lifetimeXp: 0,
      xpToday: 0,
      level: 1,
      dailyActions: [
        { id: 'act-sp', category: 'spiritual', name: 'Morning Meditation (20m)', completed: false, xpValue: 100 },
        { id: 'act-ph', category: 'physical', name: 'Strength Training', completed: false, xpValue: 100 },
        { id: 'act-rd', category: 'reading', name: 'Stoic Philosophy (15 pgs)', completed: false, xpValue: 100 },
        { id: 'act-cr', category: 'career', name: 'Deep Work Block (2h)', completed: false, xpValue: 100 },
        { id: 'act-bu', category: 'builder', name: 'Side Project Commits', completed: false, xpValue: 100 }
      ],
      reflections: [],
      unlockedAchievements: [],
      categoryXp: { spiritual: 200, physical: 300, reading: 100, career: 450, builder: 400 },
      categoryStreaks: { spiritual: 4, physical: 5, reading: 2, career: 8, builder: 6 }
    };

    const newProfile = migrateProfile(newRaw);

    const nextAccounts = [...existingAccounts, newProfile];
    localStorage.setItem('selvia_accounts', JSON.stringify(nextAccounts));

    // Log the user in actively
    setActiveUser(newProfile);
    localStorage.setItem('selvia_active_session', JSON.stringify(newProfile));

    // Since they registered, proceed them onto correct screen
    if (isCompletingOnboarding) {
      setScreen('HOME');
    } else {
      setScreen('STEP_2_IDENTITY');
    }
    return true;
  };

  // Handle logging out currently active profile session
  const handleLogOut = () => {
    setActiveUser(null);
    localStorage.removeItem('selvia_active_session');
    setIsCompletingOnboarding(false);
    setScreen('WELCOME');
  };

  // Reset local auth + states completely to retry splash onboarding over and over
  const handleResetSimState = () => {
    setActiveUser(null);
    localStorage.removeItem('selvia_active_session');
    
    // Clear draft states
    setDraftArchetype('disciplined_builder');
    setDraftCustomText('');
    setDraftMandates(getInitialMandatesDraft());
    setIsCompletingOnboarding(false);
    
    setScreen('SPLASH');
  };

  const currentThemeStyle = "bg-background-obsidian min-h-screen text-on-background relative";

  return (
    <div className={currentThemeStyle}>
      <AnimatePresence mode="wait">
        {screen === 'SPLASH' && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Splash onComplete={() => setScreen('WELCOME')} />
          </motion.div>
        )}

        {screen === 'WELCOME' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Welcome
              onBegin={() => {
                setIsCompletingOnboarding(false);
                setScreen('STEP_2_IDENTITY');
              }}
              onNavigateLogin={() => {
                setIsCompletingOnboarding(false);
                setScreen('LOGIN');
              }}
            />
          </motion.div>
        )}

        {screen === 'STEP_2_IDENTITY' && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Step2Identity
              initialArchetype={draftArchetype}
              initialCustomText={draftCustomText}
              onBack={() => setScreen('WELCOME')}
              onConfirm={(archetypeId, customText) => {
                setDraftArchetype(archetypeId);
                setDraftCustomText(customText);
                
                // If user is already logged in, update their active profile draft dynamically
                if (activeUser) {
                  handleUpdateUserProfile({
                    ...activeUser,
                    archetypeId,
                    customArchetypeText: customText
                  });
                }
                setScreen('STEP_3_MANDATES');
              }}
            />
          </motion.div>
        )}

        {screen === 'STEP_3_MANDATES' && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Step3Mandates
              initialMandates={draftMandates}
              onBack={() => setScreen('STEP_2_IDENTITY')}
              onConfirm={(mandatesList) => {
                setDraftMandates(mandatesList);
                if (activeUser) {
                  handleUpdateUserProfile({
                    ...activeUser,
                    mandates: mandatesList
                  });
                }
                setScreen('STEP_4_CONFIRM');
              }}
            />
          </motion.div>
        )}

        {screen === 'STEP_4_CONFIRM' && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Step4Confirm
              onBack={() => setScreen('STEP_3_MANDATES')}
              onEnter={() => {
                if (activeUser) {
                  // User already has an authenticated account, mark onboarding complete and go home
                  const completedProfile = {
                    ...activeUser,
                    archetypeId: draftArchetype,
                    customArchetypeText: draftCustomText,
                    mandates: draftMandates,
                    onboardingCompleted: true
                  };
                  handleUpdateUserProfile(completedProfile);
                  setScreen('HOME');
                } else {
                  // Prompt registry sign-up to capture and seal their drafted credentials
                  setIsCompletingOnboarding(true);
                  setScreen('REGISTER');
                }
              }}
            />
          </motion.div>
        )}

        {screen === 'LOGIN' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Login
              onLogin={handleLoginUser}
              onNavigateRegister={() => setScreen('REGISTER')}
              onNavigateForgotPassword={() => setScreen('RESET_PASSWORD')}
              onNavigateWelcome={() => setScreen('WELCOME')}
            />
          </motion.div>
        )}

        {screen === 'REGISTER' && (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Register
              onRegister={(moniker, email, pass) => {
                const regSuccess = handleRegisterUser(moniker, email, pass);
                if (regSuccess === true) {
                  // Mark draft values complete since they just registered post Step 4, or they register at beginning
                  setTimeout(() => {
                    if (isCompletingOnboarding) {
                      setScreen('HOME');
                    } else {
                      setScreen('STEP_2_IDENTITY');
                    }
                  }, 1200);
                  return true;
                }
                return regSuccess;
              }}
              onNavigateLogin={() => setScreen('LOGIN')}
              onNavigateWelcome={() => setScreen('WELCOME')}
            />
          </motion.div>
        )}

        {screen === 'RESET_PASSWORD' && (
          <motion.div
            key="reset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResetPassword onBack={() => setScreen('LOGIN')} />
          </motion.div>
        )}

        {screen === 'HOME' && activeUser && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Home
              userProfile={activeUser}
              onLogout={handleLogOut}
              onResetOnboarding={handleResetSimState}
              onUpdateProfile={handleUpdateUserProfile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
