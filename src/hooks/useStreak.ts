import { useState, useEffect, useCallback } from 'react';
import { storageService, KEYS } from '../services/storageService';

export function useStreak() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [streakHistory, setStreakHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStreakData = useCallback(async () => {
    setLoading(true);
    const current = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);
    const best = await storageService.getItem<number>(KEYS.BEST_STREAK, 0);
    const history = await storageService.getItem<string[]>(KEYS.STREAK_HISTORY, []);
    
    // Check if streak was broken yesterday
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lastCompleted = await storageService.getItem<string | null>(KEYS.LAST_COMPLETED_DATE, null);

    let evaluatedStreak = current;
    if (current > 0) {
      const wasYesterdayCompleted = history.includes(yesterdayStr);
      const wasTodayCompleted = lastCompleted === todayStr;

      if (!wasYesterdayCompleted && !wasTodayCompleted) {
        // Streak broken
        evaluatedStreak = 0;
        await storageService.setItem(KEYS.CURRENT_STREAK, 0);
      }
    }

    setCurrentStreak(evaluatedStreak);
    setBestStreak(best);
    setStreakHistory(history);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStreakData();
  }, [loadStreakData]);

  const incrementStreak = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextStreak = currentStreak + 1;
    
    setCurrentStreak(nextStreak);
    await storageService.setItem(KEYS.CURRENT_STREAK, nextStreak);
    await storageService.setItem(KEYS.LAST_COMPLETED_DATE, todayStr);

    if (nextStreak > bestStreak) {
      setBestStreak(nextStreak);
      await storageService.setItem(KEYS.BEST_STREAK, nextStreak);
    }

    if (!streakHistory.includes(todayStr)) {
      const nextHistory = [...streakHistory, todayStr];
      setStreakHistory(nextHistory);
      await storageService.setItem(KEYS.STREAK_HISTORY, nextHistory);
    }
  };

  const resetStreak = async () => {
    setCurrentStreak(0);
    await storageService.setItem(KEYS.CURRENT_STREAK, 0);
  };

  return {
    currentStreak,
    bestStreak,
    streakHistory,
    loading,
    incrementStreak,
    resetStreak,
    reload: loadStreakData,
  };
}
