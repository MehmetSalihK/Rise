import { useState, useCallback } from 'react';
import { goalEngine, DailyGoals } from '../core/goalEngine';
import { useFocusEffect } from '@react-navigation/native';

export function useDailyGoals() {
  const [goals, setGoals] = useState<DailyGoals | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    const data = await goalEngine.getGoals();
    setGoals(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [fetchGoals])
  );

  const saveGoals = async (newGoals: DailyGoals) => {
    setGoals(newGoals);
    await goalEngine.saveGoals(newGoals);
  };

  return {
    goals,
    loading,
    saveGoals,
    refresh: fetchGoals,
  };
}
