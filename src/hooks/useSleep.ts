import { useState, useEffect, useCallback } from 'react';
import { storageService, KEYS } from '../services/storageService';

export interface SleepLog {
  date: string;
  bedtime: string; // "HH:mm"
  waketime: string; // "HH:mm"
  duration: number; // hours
  score: 'mauvais' | 'moyen' | 'bon';
}

export function useSleep() {
  const [sleepHistory, setSleepHistory] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSleepData = useCallback(async () => {
    setLoading(true);
    const history = await storageService.getItem<SleepLog[]>(KEYS.SLEEP_HISTORY, []);
    setSleepHistory(history);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSleepData();
  }, [loadSleepData]);

  const addSleepLog = async (bedtime: string, waketime: string) => {
    const [bedH, bedM] = bedtime.split(':').map(Number);
    const [wakeH, wakeM] = waketime.split(':').map(Number);

    let duration = 0;
    if (wakeH > bedH || (wakeH === bedH && wakeM >= bedM)) {
      duration = (wakeH * 60 + wakeM - (bedH * 60 + bedM)) / 60;
    } else {
      // Overnight sleep
      duration = ((24 * 60 - (bedH * 60 + bedM)) + (wakeH * 60 + wakeM)) / 60;
    }

    duration = Number(duration.toFixed(1));

    let score: 'mauvais' | 'moyen' | 'bon' = 'moyen';
    if (duration < 6) {
      score = 'mauvais';
    } else if (duration >= 8 && duration <= 9) {
      score = 'bon';
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newLog: SleepLog = {
      date: todayStr,
      bedtime,
      waketime,
      duration,
      score,
    };

    const updatedHistory = [...sleepHistory.filter(s => s.date !== todayStr), newLog];
    setSleepHistory(updatedHistory);
    await storageService.setItem(KEYS.SLEEP_HISTORY, updatedHistory);
  };

  return { sleepHistory, loading, addSleepLog, reload: loadSleepData };
}
