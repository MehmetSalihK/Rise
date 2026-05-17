import { useState, useCallback } from 'react';
import { storageService, KEYS } from '../services/storageService';
import { aiCoachEngine } from '../core/aiCoachEngine';
import { BehaviorDiagnosis } from '../core/behaviorAnalyzer';
import { useFocusEffect } from '@react-navigation/native';
import { AuditLog } from './useCheckIn';

export function useBehavior() {
  const [diagnosis, setDiagnosis] = useState<BehaviorDiagnosis>({
    userState: 'NORMAL',
    problem: 'Aucun problème détecté.',
    recommendation: 'Dresse ton premier bilan.',
  });
  const [loading, setLoading] = useState(true);

  const fetchDiagnosis = useCallback(async () => {
    setLoading(true);

    const sleepLogs = await storageService.getItem<any[]>(KEYS.SLEEP_HISTORY, []);
    const lastSleep = sleepLogs[sleepLogs.length - 1];
    const duration = lastSleep ? lastSleep.duration : 7.5;

    const streak = await storageService.getItem<number>(KEYS.CURRENT_STREAK, 0);

    const auditHistory = await storageService.getItem<AuditLog[]>('rise_auditHistory', []);
    const scoreSum = auditHistory.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = auditHistory.length === 0 ? 70 : Math.round(scoreSum / auditHistory.length);

    const report = aiCoachEngine.diagnoseBehavior(duration, streak, 2.5, averageScore);
    setDiagnosis(report);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDiagnosis();
    }, [fetchDiagnosis])
  );

  return {
    diagnosis,
    loading,
    refresh: fetchDiagnosis,
  };
}
