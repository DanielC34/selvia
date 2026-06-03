export type AppScreen =
  | 'SPLASH'
  | 'WELCOME'
  | 'LOGIN'
  | 'REGISTER'
  | 'RESET_PASSWORD'
  | 'STEP_2_IDENTITY'
  | 'STEP_3_MANDATES'
  | 'STEP_4_CONFIRM'
  | 'HOME';

export interface MandateItem {
  id: string;
  name: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface CategoryMandates {
  spiritual: MandateItem[];
  physical: MandateItem[];
  intellect: MandateItem[];
  builder: MandateItem[];
}

export interface DailyAction {
  id: string;
  category: 'spiritual' | 'physical' | 'reading' | 'career' | 'builder';
  name: string;
  completed: boolean;
  xpValue: number;
}

export interface JournalReflection {
  date: string; // YYYY-MM-DD
  build: string;
  learn: string;
  gratitude: string;
  submitted: boolean;
}

export interface UserProfile {
  email: string;
  name: string; // "moniker"
  password?: string;
  archetypeId: string; // e.g. "disciplined_builder", "physically_active" etc or custom text
  customArchetypeText?: string;
  mandates: CategoryMandates;
  onboardingCompleted: boolean;
  streak: number;
  
  // XP & Progression Engine fields
  lifetimeXp: number;
  xpToday: number;
  level: number;
  dailyActions: DailyAction[];
  reflections: JournalReflection[];
  unlockedAchievements: string[]; // Unlocked medal IDs
  
  // Pillars of Strength scores
  categoryXp: {
    spiritual: number;
    physical: number;
    reading: number;
    career: number;
    builder: number;
  };
  
  // Active category streaks for momentum viz
  categoryStreaks: {
    spiritual: number;
    physical: number;
    reading: number;
    career: number;
    builder: number;
  };
}
