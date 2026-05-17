import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/lib/storage';

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export interface DailyLogEntry {
  completed: boolean;
}

interface AppState {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
  habits: Habit[];
  streakHistory: string[]; // List of completed dates "YYYY-MM-DD"
  history: Record<string, DailyLogEntry>; // "YYYY-MM-DD" -> { completed }
  
  toggleHabit: (id: string) => void;
  checkDailyStreakReset: () => void;
  resetAll: () => void;
}

const defaultHabits: Habit[] = [
  { id: 'water', name: 'Boire de l\'eau 💧', completed: false },
  { id: 'bed', name: 'Faire le lit 🛏️', completed: false },
  { id: 'face', name: 'Se laver le visage 🧼', completed: false },
  { id: 'stretch', name: 'S\'étirer 🧘', completed: false },
  { id: 'teeth', name: 'Brosser les dents 🪥', completed: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedDate: null,
      habits: defaultHabits,
      streakHistory: [],
      history: {},

      toggleHabit: (id) => {
        set((state) => {
          const newHabits = state.habits.map((h) =>
            h.id === id ? { ...h, completed: !h.completed } : h
          );

          const allCompleted = newHabits.every((h) => h.completed);
          const todayStr = new Date().toISOString().split('T')[0];

          let streakUpdate = state.currentStreak;
          let bestUpdate = state.bestStreak;
          let lastCompletedUpdate = state.lastCompletedDate;
          let newStreakHistory = [...state.streakHistory];
          let newHistory = { ...state.history };

          if (allCompleted) {
            // Day won!
            if (!newStreakHistory.includes(todayStr)) {
              newStreakHistory.push(todayStr);
            }
            newHistory[todayStr] = { completed: true };
            
            // Increment streak if not already rewarded today
            if (state.lastCompletedDate !== todayStr) {
              streakUpdate = state.currentStreak + 1;
              bestUpdate = Math.max(bestUpdate, streakUpdate);
              lastCompletedUpdate = todayStr;
            }
          } else {
            // If toggled back from completed to incomplete today
            if (state.lastCompletedDate === todayStr) {
              streakUpdate = Math.max(0, state.currentStreak - 1);
              lastCompletedUpdate = null;
            }
            newStreakHistory = newStreakHistory.filter((d) => d !== todayStr);
            newHistory[todayStr] = { completed: false };
          }

          // Persistence side effect
          storage.saveStreak(streakUpdate, bestUpdate);

          return {
            habits: newHabits,
            currentStreak: streakUpdate,
            bestStreak: bestUpdate,
            lastCompletedDate: lastCompletedUpdate,
            streakHistory: newStreakHistory,
            history: newHistory,
          };
        });
      },

      checkDailyStreakReset: () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const { lastCompletedDate, currentStreak, streakHistory, history } = get();

        // 1. Check if we skipped a day (meaning yesterday was NOT completed AND yesterday wasn't recorded as completed)
        if (currentStreak > 0) {
          const wasYesterdayCompleted = streakHistory.includes(yesterdayStr);
          const wasTodayCompleted = lastCompletedDate === todayStr;

          // If yesterday wasn't completed and we are on a new day without completing today yet
          if (!wasYesterdayCompleted && !wasTodayCompleted) {
            // Break the chain!
            set(() => ({
              currentStreak: 0,
            }));
            storage.saveStreak(0, get().bestStreak);

            // Backfill yesterday as failed in history
            set((state) => {
              const updatedHistory = { ...state.history };
              if (!updatedHistory[yesterdayStr]) {
                updatedHistory[yesterdayStr] = { completed: false };
              }
              return { history: updatedHistory };
            });
          }
        }

        // 2. Perform daily reset of checkboxes if day rolled over
        const lastActiveDate = localStorage.getItem('rise-hard-active-date');
        if (lastActiveDate && lastActiveDate !== todayStr) {
          // Roll over! Save yesterday status in history
          set((state) => {
            const yesterdayCompleted = state.habits.every(h => h.completed);
            const updatedHistory = { ...state.history };
            updatedHistory[yesterdayStr] = { completed: yesterdayCompleted };
            return {
              habits: defaultHabits,
              history: updatedHistory
            };
          });
        }
        localStorage.setItem('rise-hard-active-date', todayStr);
      },

      resetAll: () => {
        set(() => ({
          currentStreak: 0,
          bestStreak: 0,
          lastCompletedDate: null,
          habits: defaultHabits,
          streakHistory: [],
          history: {},
        }));
        storage.saveStreak(0, 0);
      },
    }),
    {
      name: 'rise-hard-storage',
    }
  )
);
