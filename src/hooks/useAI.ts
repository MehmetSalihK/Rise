import { useState, useCallback } from 'react';
import { useRoutine } from './useRoutine';
import { useSleep } from './useSleep';
import { useStreak } from './useStreak';
import { aiService, UserMood } from '../services/aiService';
import { disciplineEngine, AIAnalysisOutput } from '../ai/disciplineEngine';
import { useFocusEffect } from '@react-navigation/native';

export function useAI() {
  const { habits, reload: reloadRoutine } = useRoutine();
  const { sleepHistory, reload: reloadSleep } = useSleep();
  const { currentStreak, reload: reloadStreak } = useStreak();

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
    
    // Reload underlyings
    await reloadRoutine();
    await reloadSleep();
    await reloadStreak();

    const storedMood = await aiService.getUserMood();
    const storedScreen = await aiService.getScreenTimeHours();

    setMood(storedMood);
    setScreenTime(storedScreen);

    // Get sleep metrics
    const lastSleep = sleepHistory[sleepHistory.length - 1];
    const duration = lastSleep ? lastSleep.duration : 7.5;
    const bedtime = lastSleep ? lastSleep.bedtime : '22:30';

    // Get routine metrics
    const completedCount = habits.filter(h => h.completed).length;
    const totalCount = habits.length;
    const completionRate = totalCount === 0 ? 0 : completedCount / totalCount;
    const isCompletedEarly = completedCount === totalCount && new Date().getHours() < 10;

    const result = disciplineEngine.analyze(
      storedMood,
      duration,
      bedtime,
      completionRate,
      isCompletedEarly,
      currentStreak,
      storedScreen
    );

    setAnalysis(result);
    await aiService.logDailyScore(result.disciplineScore);
    setLoading(false);
  }, [habits, sleepHistory, currentStreak, reloadRoutine, reloadSleep, reloadStreak]);

  useFocusEffect(
    useCallback(() => {
      runAnalysis();
    }, [runAnalysis])
  );

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
