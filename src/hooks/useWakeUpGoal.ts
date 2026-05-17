import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { storageService } from '../services/storageService';
import { wakeUpEngine } from '../core/wakeUpEngine';

export function useWakeUpGoal() {
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [isAwake, setIsAwake] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWakeState = useCallback(async () => {
    setLoading(true);
    const time = await storageService.getItem<string>('rise_wake_alarm_time', '07:00');
    const awake = await storageService.getItem<boolean>('rise_awake_today', false);
    setWakeTime(time);
    setIsAwake(awake);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWakeState();
    }, [fetchWakeState])
  );

  const confirmAwake = async () => {
    setIsAwake(true);
    await wakeUpEngine.setAwakeStatus(true);
  };

  const updateWakeTimeGoal = async (newTime: string) => {
    setWakeTime(newTime);
    setIsAwake(false);
    await wakeUpEngine.scheduleSequentialWakeUp(newTime);
  };

  return {
    wakeTime,
    isAwake,
    loading,
    confirmAwake,
    updateWakeTimeGoal,
    refresh: fetchWakeState,
  };
}
