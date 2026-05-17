import { useState, useCallback } from 'react';
import { storageService, KEYS } from '../services/storageService';
import { aiCoachEngine } from '../core/aiCoachEngine';
import { DailyPlan } from '../core/dailyPlanGenerator';
import { useFocusEffect } from '@react-navigation/native';

export function useDailyPlan() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    const todayStr = new Date().toISOString().split('T')[0];
    const savedPlan = await storageService.getItem<DailyPlan | null>('rise_dailyPlan', null);

    if (savedPlan && savedPlan.date === todayStr) {
      setPlan(savedPlan);
      setLoading(false);
      return;
    }

    // Rollover: Generate new Daily Plan for today
    const sleepLogs = await storageService.getItem<any[]>(KEYS.SLEEP_HISTORY, []);
    const lastSleep = sleepLogs[sleepLogs.length - 1];
    const duration = lastSleep ? lastSleep.duration : 7.5;

    const currentStreak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);

    const generated = await aiCoachEngine.getDailyPlan(duration, currentStreak, 2.5);
    await storageService.setItem('rise_dailyPlan', generated);
    setPlan(generated);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlan();
    }, [fetchPlan])
  );

  const toggleAction = async (id: string) => {
    if (!plan) return;

    const updatedActions = plan.actions.map(action =>
      action.id === id ? { ...action, completed: !action.completed } : action
    );
    const updatedPlan = { ...plan, actions: updatedActions };
    
    setPlan(updatedPlan);
    await storageService.setItem('rise_dailyPlan', updatedPlan);
  };

  return {
    plan,
    loading,
    toggleAction,
    recalculate: fetchPlan,
  };
}
