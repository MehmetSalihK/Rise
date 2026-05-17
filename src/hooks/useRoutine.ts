import { useState, useEffect, useCallback } from 'react';
import { storageService, KEYS } from '../services/storageService';

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

const defaultHabits: Habit[] = [
  { id: 'water', name: 'Boire de l\'eau 💧', completed: false },
  { id: 'bed', name: 'Faire le lit 🛏️', completed: false },
  { id: 'teeth', name: 'Brosser les dents 🪥', completed: false },
  { id: 'stretch', name: 'S\'étirer 🧘', completed: false },
  { id: 'meditate', name: 'Méditer 🧠', completed: false },
];

export function useRoutine() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    setLoading(true);
    const saved = await storageService.getItem<Habit[]>(KEYS.HABITS, defaultHabits);
    
    // Auto reset routine on new day rollover
    const todayStr = new Date().toISOString().split('T')[0];
    const lastActive = await storageService.getItem<string | null>(KEYS.LAST_COMPLETED_DATE, null);
    
    if (lastActive && lastActive !== todayStr) {
      // Roll over to new day
      const reset = defaultHabits.map(h => ({ ...h, completed: false }));
      await storageService.setItem(KEYS.HABITS, reset);
      setHabits(reset);
    } else {
      setHabits(saved);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const toggleHabit = async (id: string) => {
    const updated = habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h);
    setHabits(updated);
    await storageService.setItem(KEYS.HABITS, updated);

    // Dynamic Streak check
    const allDone = updated.every(h => h.completed);
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (allDone) {
      await storageService.setItem(KEYS.LAST_COMPLETED_DATE, todayStr);
      
      const currentStreak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);
      const lastCompleted = await storageService.getItem<string | null>(KEYS.LAST_COMPLETED_DATE, null);
      
      if (lastCompleted !== todayStr) {
        const nextStreak = currentStreak + 1;
        await storageService.setItem(KEYS.CURRENT_STREAK, nextStreak);
        
        const bestStreak = await storageService.getItem<number>(KEYS.BEST_STREAK, 0);
        if (nextStreak > bestStreak) {
          await storageService.setItem(KEYS.BEST_STREAK, nextStreak);
        }

        const streakHistory = await storageService.getItem<string[]>(KEYS.STREAK_HISTORY, []);
        if (!streakHistory.includes(todayStr)) {
          await storageService.setItem(KEYS.STREAK_HISTORY, [...streakHistory, todayStr]);
        }
      }
    }
  };

  const resetRoutine = async () => {
    await storageService.setItem(KEYS.HABITS, defaultHabits);
    setHabits(defaultHabits);
  };

  return { habits, loading, toggleHabit, resetRoutine, reload: loadHabits };
}
