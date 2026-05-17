import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export interface SleepData {
  date: string; // YYYY-MM-DD
  bedtime: string; // HH:mm
  wakeTime: string; // HH:mm
  duration: number; // hours
  score: number;
}

export interface HygieneData {
  date: string; // YYYY-MM-DD
  morning: boolean;
  noon: boolean;
  night: boolean;
}

interface AppState {
  // Settings & Profile
  userName: string;
  wakeGoal: string; // HH:mm
  sleepGoal: string; // HH:mm
  xp: number; // V3 Gamification
  focusModeActive: boolean; // V3 Focus Mode
  setSettings: (settings: Partial<AppState>) => void;

  // Daily Habits (Morning Routine)
  habits: Habit[];
  toggleHabit: (id: string) => void;
  resetDailyHabits: () => void;

  // Sleep
  sleepHistory: SleepData[];
  addSleepData: (data: SleepData) => void;

  // Hygiene
  hygieneHistory: HygieneData[];
  updateHygiene: (date: string, time: 'morning' | 'noon' | 'night', completed: boolean) => void;

  // Discipline & Streak Score
  disciplineScore: number;
  currentStreak: number;
  streakHistory: string[]; // dates of fully completed routines: "YYYY-MM-DD"
  updateDisciplineScore: (delta: number) => void;
  checkStreak: () => void; // checks if streak needs to be updated or has broken

  // Supabase Sync States
  userId: string | null;
  syncing: boolean;
  setUserId: (id: string | null) => void;
  setSyncing: (syncing: boolean) => void;

  // Utilities
  resetAll: () => void;
}

const defaultHabits: Habit[] = [
  { id: 'water', name: 'Boire de l\'eau 💧', completed: false },
  { id: 'face', name: 'Se laver le visage 🧼', completed: false },
  { id: 'teeth', name: 'Brosser les dents 🪥', completed: false },
  { id: 'bed', name: 'Faire le lit 🛏️', completed: false },
  { id: 'stretch', name: 'Étirements 🧘', completed: false },
  { id: 'meditate', name: 'Méditation 🧠', completed: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: 'Utilisateur',
      wakeGoal: '07:00',
      sleepGoal: '22:30',
      xp: 0,
      focusModeActive: false,
      setSettings: (settings) => set((state) => ({ ...state, ...settings })),

      habits: defaultHabits,
      toggleHabit: (id) => {
        set((state) => {
          const newHabits = state.habits.map((h) =>
            h.id === id ? { ...h, completed: !h.completed } : h
          );
          
          const completedCount = newHabits.filter((h) => h.completed).length;
          const isAllCompleted = completedCount === newHabits.length;
          const wasAllCompleted = state.habits.every((h) => h.completed);
          
          let scoreDelta = 0;
          let xpDelta = 10; // +10 XP for checking habit

          // If toggled from checked to unchecked
          const targetedHabit = state.habits.find(h => h.id === id);
          if (targetedHabit?.completed) {
            xpDelta = -10;
          }

          if (isAllCompleted) {
            scoreDelta = 10; // Complete routine reward
            xpDelta += 50; // +50 XP bonus for completing whole routine
          } else if (wasAllCompleted && !isAllCompleted) {
            scoreDelta = -10; // Penalty
            xpDelta -= 50; // Lose routine completion bonus
          }

          return { 
            habits: newHabits,
            xp: Math.max(0, state.xp + xpDelta),
            disciplineScore: Math.min(100, Math.max(0, state.disciplineScore + scoreDelta))
          };
        });

        // Trigger streak check on completion change
        get().checkStreak();
      },
      
      resetDailyHabits: () =>
        set(() => ({
          habits: defaultHabits,
        })),

      sleepHistory: [],
      addSleepData: (data) =>
        set((state) => {
          const filtered = state.sleepHistory.filter((d) => d.date !== data.date);
          const newHistory = [...filtered, data];
          
          // Reward early/regular sleep with discipline & XP boost
          const durationGoalMet = data.duration >= 7 && data.duration <= 9;
          const scoreDelta = durationGoalMet ? 5 : -2;
          const xpDelta = durationGoalMet ? 30 : 10;

          return { 
            sleepHistory: newHistory,
            xp: Math.max(0, state.xp + xpDelta),
            disciplineScore: Math.min(100, Math.max(0, state.disciplineScore + scoreDelta))
          };
        }),

      hygieneHistory: [],
      updateHygiene: (date, time, completed) =>
        set((state) => {
          const existingIndex = state.hygieneHistory.findIndex((h) => h.date === date);
          let newHistory = [...state.hygieneHistory];
          
          if (existingIndex >= 0) {
            newHistory[existingIndex] = { ...newHistory[existingIndex], [time]: completed };
          } else {
            const newEntry: HygieneData = { date, morning: false, noon: false, night: false, [time]: completed };
            newHistory.push(newEntry);
          }

          // Compute discipline delta based on hygiene habit change
          const scoreDelta = completed ? 2 : -2;
          const xpDelta = completed ? 5 : -5;

          return { 
            hygieneHistory: newHistory,
            xp: Math.max(0, state.xp + xpDelta),
            disciplineScore: Math.min(100, Math.max(0, state.disciplineScore + scoreDelta))
          };
        }),

      disciplineScore: 50,
      currentStreak: 0,
      streakHistory: [],
      
      updateDisciplineScore: (delta) =>
        set((state) => ({
          disciplineScore: Math.min(100, Math.max(0, state.disciplineScore + delta)),
        })),

      checkStreak: () => {
        const { habits, streakHistory } = get();
        const todayStr = new Date().toISOString().split('T')[0];
        
        const allRoutineCompleted = habits.every(h => h.completed);
        const isTodayStreakRecorded = streakHistory.includes(todayStr);

        if (allRoutineCompleted && !isTodayStreakRecorded) {
          set((state) => ({
            streakHistory: [...state.streakHistory, todayStr],
            currentStreak: state.currentStreak + 1,
            xp: state.xp + 40, // Bonus XP for keeping the flame alive!
            disciplineScore: Math.min(100, state.disciplineScore + 15)
          }));
        } else if (!allRoutineCompleted && isTodayStreakRecorded) {
          set((state) => ({
            streakHistory: state.streakHistory.filter(d => d !== todayStr),
            currentStreak: Math.max(0, state.currentStreak - 1),
            xp: Math.max(0, state.xp - 40),
            disciplineScore: Math.max(0, state.disciplineScore - 15)
          }));
        }
      },

      // Supabase States
      userId: null,
      syncing: false,
      setUserId: (userId) => set({ userId }),
      setSyncing: (syncing) => set({ syncing }),

      resetAll: () =>
        set(() => ({
          userName: 'Utilisateur',
          wakeGoal: '07:00',
          sleepGoal: '22:30',
          xp: 0,
          focusModeActive: false,
          habits: defaultHabits,
          sleepHistory: [],
          hygieneHistory: [],
          disciplineScore: 50,
          currentStreak: 0,
          streakHistory: [],
          userId: null,
          syncing: false,
        })),
    }),
    {
      name: 'rise-storage',
      partialize: (state) => ({
        userName: state.userName,
        wakeGoal: state.wakeGoal,
        sleepGoal: state.sleepGoal,
        xp: state.xp,
        focusModeActive: state.focusModeActive,
        habits: state.habits,
        sleepHistory: state.sleepHistory,
        hygieneHistory: state.hygieneHistory,
        disciplineScore: state.disciplineScore,
        currentStreak: state.currentStreak,
        streakHistory: state.streakHistory,
        userId: state.userId
      })
    }
  )
);

// Derived Gamification Levels Helper
export function getDisciplineLevel(xp: number): {
  levelName: string;
  badge: string;
  nextLevelXp: number;
  percent: number;
} {
  if (xp < 150) {
    return { levelName: "Beginner", badge: "🧘", nextLevelXp: 150, percent: Math.round((xp / 150) * 100) };
  } else if (xp < 400) {
    return { levelName: "Consistent", badge: "⚡️", nextLevelXp: 400, percent: Math.round(((xp - 150) / 250) * 100) };
  } else if (xp < 800) {
    return { levelName: "Disciplined", badge: "🔥", nextLevelXp: 800, percent: Math.round(((xp - 400) / 400) * 100) };
  } else {
    return { levelName: "Machine", badge: "🤖", nextLevelXp: 9999, percent: 100 };
  }
}

// Derived State Helper for Energy Level (0-100)
export function getEnergyScore(state: { sleepHistory: SleepData[]; habits: Habit[]; currentStreak: number }): {
  score: number;
  emoji: string;
  label: string;
  colorClass: string;
} {
  let score = 30; // base energy level

  // 1. Sleep Impact (up to 40 points)
  const lastSleep = state.sleepHistory[state.sleepHistory.length - 1];
  if (lastSleep) {
    if (lastSleep.duration >= 7.5 && lastSleep.duration <= 9) {
      score += 40; // Optimal sleep
    } else if (lastSleep.duration >= 6 && lastSleep.duration < 7.5) {
      score += 25; // Decent sleep
    } else if (lastSleep.duration > 9) {
      score += 20; // Over-sleep
    } else {
      score += 5; // Sleep deprived
    }
  } else {
    score += 20; // default sleep points
  }

  // 2. Habits Completed (up to 30 points)
  const completedHabits = state.habits.filter(h => h.completed).length;
  const totalHabits = state.habits.length;
  if (totalHabits > 0) {
    score += Math.round((completedHabits / totalHabits) * 30);
  }

  // 3. Streak regularity bonus (up to 30 points)
  const streakBonus = Math.min(30, state.currentStreak * 6);
  score += streakBonus;

  // Cap it
  score = Math.min(100, score);

  // Determine dynamic details
  let emoji = "😐";
  let label = "Normal";
  let colorClass = "from-amber-500 to-yellow-400 shadow-amber-500/10";

  if (score >= 80) {
    emoji = "⚡️";
    label = "En pleine forme !";
    colorClass = "from-indigo-500 to-purple-500 shadow-indigo-500/20";
  } else if (score >= 50) {
    emoji = "🔋";
    label = "Bonne énergie";
    colorClass = "from-blue-500 to-teal-400 shadow-blue-500/10";
  } else if (score < 40) {
    emoji = "😴";
    label = "Fatigué(e)";
    colorClass = "from-rose-500 to-orange-400 shadow-rose-500/10";
  }

  return { score, emoji, label, colorClass };
}
