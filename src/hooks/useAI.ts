import { useState, useCallback } from 'react';
import { useRoutine, Habit } from './useRoutine';
import { useSleep, SleepLog } from './useSleep';
import { useStreak } from './useStreak';
import { storageService, KEYS } from '../services/storageService';
import { aiService, UserMood } from '../services/aiService';
import { disciplineEngine, AIAnalysisOutput } from '../ai/disciplineEngine';

const defaultHabits: Habit[] = [
  { id: 'water', name: 'Boire de l\'eau 💧', completed: false },
  { id: 'bed', name: 'Faire le lit 🛏️', completed: false },
  { id: 'teeth', name: 'Brosser les dents 🪥', completed: false },
  { id: 'stretch', name: 'S\'étirer 🧘', completed: false },
  { id: 'meditate', name: 'Méditer 🧠', completed: false },
];

export function useAI() {
  const [mood, setMood] = useState<UserMood>('normal');
  const [screenTime, setScreenTime] = useState(2.5);
  const [analysis, setAnalysis] = useState<AIAnalysisOutput>({
    disciplineScore: 50,
    aiReport: {
      userState: 'NORMAL',
      recommendation: 'normal day',
      risks: [],
    },
    motivationalMessage: 'Reste focus et avance.',
  });
  const [loading, setLoading] = useState(true);

  const runAnalysis = useCallback(async () => {
    setLoading(true);

    const storedMood = await aiService.getUserMood();
    const storedScreen = await aiService.getScreenTimeHours();

    // 1. Fetch values directly from storage to avoid state dependency loops
    const storedHabits = await storageService.getItem<Habit[]>(KEYS.HABITS, defaultHabits);
    const storedSleep = await storageService.getItem<SleepLog[]>(KEYS.SLEEP_HISTORY, []);
    const storedStreak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);

    setMood(storedMood);
    setScreenTime(storedScreen);

    // Get sleep metrics
    const lastSleep = storedSleep[storedSleep.length - 1];
    const duration = lastSleep ? lastSleep.duration : 7.5;
    const bedtime = lastSleep ? lastSleep.bedtime : '22:30';

    // Get routine metrics
    const completedCount = storedHabits.filter(h => h.completed).length;
    const totalCount = storedHabits.length;
    const completionRate = totalCount === 0 ? 0 : completedCount / totalCount;
    const isCompletedEarly = completedCount === totalCount && new Date().getHours() < 10;

    const result = disciplineEngine.analyze(
      storedMood,
      duration,
      bedtime,
      completionRate,
      isCompletedEarly,
      storedStreak,
      storedScreen
    );

    setAnalysis(result);
    await aiService.logDailyScore(result.disciplineScore);
    setLoading(false);
  }, []); // Completely empty dependency array: stable callback reference guaranteed

  const updateMood = async (newMood: UserMood) => {
    setMood(newMood);
    await aiService.setUserMood(newMood);
    await runAnalysis();
  };

  const updateScreenTime = async (hours: number) => {
    setScreenTime(hours);
    await aiService.setScreenTimeHours(hours);
    await runAnalysis();
  };

  return {
    mood,
    screenTime,
    analysis,
    loading,
    updateMood,
    updateScreenTime,
    recalculate: runAnalysis,
  };
}
